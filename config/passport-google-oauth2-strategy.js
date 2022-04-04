const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//creating passport strategy
passport.use(new googleStrategy({
    clientID : "444118020441-dsvdkhhurr1qh5guncmekic6h647g7ha.apps.googleusercontent.com",
    clientSecret : "EVoeFUxUGtrkhDhlJt8dMsZ4",
    callbackURL : "http://localhost:8000/users/auth/google/callback"
},
    function(accessToken, refreshToken, profile, done){
        User.findOne({email : profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log('error in passport-google-oauth',err);
                return;
            }
            console.log(profile);

            //if user exist
            if(user){
                return done(null,user);
            }else{    //if not then create one
                User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                }, function(err,user){
                    if(err){
                        console.log('error in passport-google-oauth',err);
                        return;
                    }
                    return done(null,user);
                });
            }
        });
    }
))

module.exports = passport;