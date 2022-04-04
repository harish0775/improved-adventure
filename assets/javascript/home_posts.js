{   
    //-------------------------creating post-----------------------------------------------------
    // console.log('hey');
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type : 'post',
                url : '/posts/create',
                data : newPostForm.serialize(),
                success : function(data){
                    console.log(data);
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($('.delete-post-button',newPost));

                     // call the create comment class
                     new postComments(data.data.post._id);

                     //calling likes present in a post
                     new ToggleLike($(' .toggle-like-button', newPost)); 

                    new Noty({
                        theme: 'relax',
                        text: "Post Created!",
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

    let newPostDom = function(post){
        return $(`
           <li id="post-${post._id}">
    <p>
            <p>
                <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
            </p>    
        ${post.content}
        <small>
            ${post.user.name}
        </small> 
        <br>
        <small>
            
                <a class = "toggle-like-button" data-likes = "0" href="/likes/toggle/?id=${post._id}&type=Post">
                    0 Likes
                </a>    
        </small>
    </p>   
    <div>
            <form action="/comments/create" method="POST" id="post-${post._id}-comments-form">
                <input type="text" name="content" placeholder="Type here to comment">
                <input type="hidden" name="post" value="${post._id}">
                <input type="submit" value="Add Comment">
            </form>
    </div> 

        
    <div class="post-comments-list">
        <ul id="post-comments-${post._id}">
           
        </ul>
    </div>

</li>
            `)
        }

        //----------------------------------deleting post-------------------------------------

        let deletePost = function(deleteLink){
            $(deleteLink).click(function(e){
                e.preventDefault();

                $.ajax({
                    type : 'get',
                    url : $(deleteLink).prop('href'),
                    success : function(data){
                        console.log(data);
                        $(`#post-${data.data.post_id}`).remove();
                    },
                    error : function(error){
                        console.log(error.responseText);
                    }
                });
            });
        }

        
    let convertPostsToAjax = function(){
        $('#post-list-container>ul>li').each(function(){
            let self = $(this); 
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            //another method
            // $('.delete-post-button',$(this)).each(function(){
            //     deletePost($(this));
            // });

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1] 
            new postComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}