var Admin = require('../../models/adminuser');
var bcrypt = require('bcryptjs');
//var checkPermission = require('../../config/checkPermission');


module.exports.controller = function (app, passport) {

    app.get('/admin', function (req, res) {
        if (req.session.Admin) {
            res.redirect("/admin/dashboard");
        }
        res.render('admin/login', {page_title: "Login ", req: req});
    });

    app.get('/admin/login', function (req, res) {
        if (req.session.Admin) {
            res.redirect("/admin/dashboard");
        }
        res.render('admin/login', {page_title: "Login ", req: req});
    });


    app.post('/admin/login/postdata', function (req, res, next) {
        req.check('email', 'Email is required').isEmail();
        req.check('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            var json = {};
            var error = 1;
            var error_mess = "Login authentication failed";
            res.render('admin/login', {page_title: "Login ", req: req, error: error, error_mess: error_mess});
        } else {
            Admin.findOne({email: req.body.email}, function (err, userdata) {
                if (err)
                    throw err;
                
                if (!userdata) {
                    var error = 1;
                    var error_mess = "Login authentication failed";
                    res.render('admin/login', {page_title: "Login ", req: req, error: error, error_mess: error_mess});
                } else {
                    bcrypt.compare(req.body.password, userdata.password, function (err, matchpass) {
                        if (err)
                            throw err;
                        if (matchpass) {
                            var json = {};
                            json['success'] = 1;
                            json['success_mess'] = "Authenticated successfully !";
                            req.session.Admin = userdata;
                            return res.redirect('/admin/dashboard');

                        } else {
                            var error = 1;
                            var error_mess = "Login authentication failed";
                            res.render('admin/login', {page_title: "Login ", req: req, error: error, error_mess: error_mess});
                        }

                    });
                }
            });
        }

    });

    app.get('/admin/logout', function (req, res) {
        req.session.destroy();
        res.redirect('admin/login');
    });

};




function randomString() {
    var length = 25;
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
