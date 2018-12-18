var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../../models/user');

TwitterStrategy = require("passport-twitter").Strategy;


passport.use(new TwitterStrategy({
    consumerKey: 'RJaLUNA30rojeJBdBWgGsQmCB', // RJaLUNA30rojeJBdBWgGsQmCB
    consumerSecret: 'YclIoiGMrwgNpCcZOH5qaQW0vACFjFkVavx1ZGZd9tMs1bLUj4', //YclIoiGMrwgNpCcZOH5qaQW0vACFjFkVavx1ZGZd9tMs1bLUj4
    callbackURL: "http://127.0.0.1:8080/auth/twitter/callback"
}, function (token, tokenSecret, profile, cb) {
    User.findOne({twitter_id: profile.id}, function (err, sresult) {
        if (sresult) {
            req.session.Auth = sresult;
            res.redirect("/");
        } else {
            var UserObj = new User({
                first_name: profile.name,
                last_name: profile.name,
                twitter_id: profile.id,
                created_at: new Date(),
                updated_at: new Date()
            });
            UserObj.save(function (err, userdata) {
                if (err)
                    res.send(err);
                req.session.Auth = userdata;
                res.redirect("/");
            });
        }
    });
}
));


module.exports.controller = function (app) {

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
            function (req, res) {
               
                //res.redirect('/');
            });
};

