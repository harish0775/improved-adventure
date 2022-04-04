const express = require('express');
const app = express();
const port = 8000;

//importing cookie parser
const cookieParser = require('cookie-parser');

//passport setup
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//passport-jwt-setup
const passportJwt = require('./config/passport-jwt-strategy');

//passport google auth
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//configuring the database
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo')(session);

//importing express-ejs-layout for same layout in each page install express-ejs-layouts for this
const expressLayouts = require('express-ejs-layouts');

//importing sass middleware
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
//---------------------------------------------------------------------middleware--------------------------------------------------------------------
//middleware for sass
app.use(sassMiddleware({
    src : './assets/scss',
    dest : './assets/css',
    debug : true,
    outputStyle : 'extended',
    prefix : '/css'
}));

//middleware for form parser
app.use(express.urlencoded());

//middleware for cookie parser install cookie-parser for this
app.use(cookieParser());

//importing the assets folder----above than ./routes file
app.use(express.static('./assets'));

//importing for profile pic for multer
app.use('/uploads',express.static(__dirname + '/uploads'));
                        //or
// app.use('/uploads',express.static('./uploads'));
// app.use('/uploads',express.static(path.join(__dirname , '/uploads')));

//using expressLayouts
app.use(expressLayouts);

//these are used so that css file links goes into header after page reload
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//setup view engine
app.set('view engine','ejs');
app.set('views','./views');

//middleware for passport
app.use(session({
    name: 'codeial',
    //TODO change this in production
    secret : 'blahsomething',
    saveUninitialized : false,
    resave : false,
    cookie : {
        maxAge: (100*60*100)
    },
    store : new MongoStore({
        mongooseConnection : db,
        autoRemove:'disabled'
    },function(err){
        console.log(err||'connect mongo db setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

//made in config file
app.use(passportLocal.setAuthenticatedUser);

//import flash should be after session
app.use(flash());
app.use(customMware.setFlash);

//use express router-----below assets
app.use('/',require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log(`error in running server : ${err}`);
    }
    console.log(`server is running on port : ${port}`);
})