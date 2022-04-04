
class postComments{
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        console.log('called',postId);
        this.createComment(postId);

        let self = this;
        // console.log('outer',$(this));
        // console.log('cont',self.postContainer);
        $('.delete-comment-button',self.postContainer).each(function(){
            // console.log('inner',$(this));
            self.deleteComment($(this));
        });
    }

    createComment(postId){
        let globalSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;
            $.ajax({
                type : 'post',
                url : '/comments/create',
                data : $(self).serialize(),
                success : function(data){
                    console.log(data);
                    let newComment = globalSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    globalSelf.deleteComment($('.delete-comment-button',newComment));
                    new ToggleLike($('.toggle-like-button',newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    newCommentDom(comment){
        return $(`
        <li id="comment-${comment._id}">
        <p>
            
                <p>
                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                </p>    
            
            ${comment.content}
            <small>
                ${comment.user.name}
            </small>
            <small>
           
                <a class = "toggle-like-button" data-likes = "0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                    0 Likes
                </a>    
        
        </small>
        </p>    
    </li>
        `)
    }

    deleteComment(deleteLink){
       $(deleteLink).click(function(e){
           e.preventDefault();

           $.ajax({
            type : 'get',
            url : $(deleteLink).prop('href'),
            success : function(data){
                console.log(data);
                $(`#comment-${data.data.comment_id}`).remove();
            },
            error : function(error){
                console.log(error.responseText);
            }
        });
       });
    }

}