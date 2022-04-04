const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smpt.gmail.com',
    port: 587,
    secure: false,
    auth : {
        user : 'harshv521',
        pass : '***'//hidden for sometime
    }
});

let renderTemplate = (data,relativePath) => {
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering mail',err);
                return;
            }

            mailHtml = template
        }
    )

    return mailHtml;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}