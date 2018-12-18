var User = require('../../models/user');
var Mail = require('../../config/sendmail');
var bcrypt = require('bcryptjs');
var bcryptjs = require('bcryptjs');
var Category = require('../../models/category');

module.exports.controller = function (app) {

    app.get('/login', function (req, res) {
        var type = req.query['type'];
        var refid = req.query['token'];
        User.find({}).limit(2).exec(function (err, userdata) {
            if (err)
                throw err;
            Category.find().exec(function (err, catdata) {
                if (err)
                    throw err;
                Category.aggregate([{
                    $lookup: {
                        from: 'posts',
                        localField: "_id",
                        foreignField: "category",
                        as: 'posts'
                    }
                }, { $limit: 5 }
                ]).exec(function (err, ccdata) {
                    if (err)
                        throw err;
                    res.render('front/home/index', { page_title: "Home", req: req, catdata: catdata, type: type, refid: refid, userdata: userdata, ccdata: ccdata, login_page: true });
                });
            });

        });
    });
    // app.get('/login', function (req, res) {
    //     if (req.session.Auth) {
    //         res.redirect("/");
    //     }
    //     res.render('front/auth/login', {page_title: "Login ", req: req});
    // });


    app.post('/login/postdata', function (req, res) {

        req.check('email', 'Email is required').notEmpty();
        req.check('email', 'Please Enter Valid Email Address').isEmail();
        req.check('email', 'Please Enter Valid Email Address').len(6, 255);
        req.check('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            User.findOne({ email: req.body.email }, function (err, userdata) {
                if (!userdata) {
                    var json = {};
                    json['error'] = 2;
                    json['error_mess'] = "Login authentication failed";
                    res.send(json);
                } else {
                    bcrypt.compare(req.body.password, userdata.password, function (err, result) {
                        var json = {};
                        if (result) {
                            json['success'] = 1;
                            json['success_mess'] = "Authenticated successfully !";
                            json['userdata'] = userdata;
                            req.session.Auth = userdata;
                        } else {
                            json['error'] = 2;
                            json['error_mess'] = "Authenticated Failed";
                        }
                        res.send(json);

                    });
                }
            });
        }
    });


    app.get('/signup', function (req, res) {
        var type = req.query['type'];
        var refid = req.query['token'];
        User.find({}).limit(2).exec(function (err, userdata) {
            if (err)
                throw err;
            Category.find().exec(function (err, catdata) {
                if (err)
                    throw err;
                Category.aggregate([{
                    $lookup: {
                        from: 'posts',
                        localField: "_id",
                        foreignField: "category",
                        as: 'posts'
                    }
                }, { $limit: 5 }
                ]).exec(function (err, ccdata) {
                    if (err)
                        throw err;
                    res.render('front/home/index', { page_title: "Home", req: req, catdata: catdata, type: type, refid: refid, userdata: userdata, ccdata: ccdata, signup_page: true });
                });
            });

        });
    });
    // app.get('/signup', function (req, res) {
    //     if (req.session.Auth) {
    //         res.redirect("/");
    //     }
    //     res.render('front/auth/signup', { page_title: "Volunteer Registration", user_type: 'volunteer', req: req });
    // });

    app.post('/signup/postdata', function (req, res) {


        req.check('first_name', "First Name is required").notEmpty();
        req.check('first_name', "First Name is not valid").len(2, 45);
        req.check('first_name', "Only Alphabets are allowed ").isAlpha();

        req.check('last_name', "Last Name is required").notEmpty();
        req.check('last_name', "Last Name is not valid").len(2, 45);
        req.check('last_name', "Only Alphabets are allowed").isAlpha();
        req.check('email', 'Email is required').notEmpty();
        req.check('email', 'Please Enter Valid Email Address').isEmail();
        req.check('email', 'Please Enter Valid Email Address').len(6, 255);
        req.check('mobile_number', 'Mobile Number is required').notEmpty();
        ;
        req.check('mobile_number', 'Please enter valid mobile number').isInt();
        req.check('mobile_number', 'Mobile must be equal or greater than 8').len(8, 15);
        req.check('password', 'Password is required').notEmpty().equals(req.body.conf_password);

        // req.check('password', 'Password must contain at least 1 lowercase,1 uppercase,1 numeric, alphabetical character,1 special character').matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
        req.check('conf_password', 'Confirm Password is required').notEmpty();
        // req.check('conf_password', 'Confirm Password must contain at least 1 lowercase,1 uppercase,1 numeric, alphabetical character,1 special character').matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            User.findOne({ email: req.body.email }, function (err, sresult) {
                if (sresult) {
                    var json = {};
                    json['error'] = 2;
                    json['error_mess'] = "Email is already exists";
                    res.send(json);
                } else {
                    var hashedPassword = bcryptjs.hashSync(req.body.password, 10);
                    var UserObj = new User({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        mobile_no: req.body.mobile_number,
                        email: req.body.email,
                        refid: req.body.refid,
                        password: hashedPassword,
                        created_at: new Date(),
                        updated_at: new Date()
                    });

                    UserObj.save(function (err, userdata) {
                        if (err) {
                            res.send(err);
                        }
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Record inserted successfully!";
                        json['userdata'] = userdata;
                        req.session.Auth = userdata;
                        res.send(json);
                    });
                }
            });
        }
    });

    app.get('/forget-password', function (req, res) {
        if (req.session.Auth) {
            res.redirect("/");
        }
        res.render('front/auth/forgetpass', { page_title: "Forget Password ", req: req });
    });

    app.post('/forgetpass/postdata', function (req, res) {
        req.check('email', 'Valid Email is required').len(6, 64).isEmail();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            User.findOne({ email: req.body.email }, function (err, userdata) {
                if (err) {
                    throw err;
                }
                if (userdata) {
                    userdata.reset_token = randomString();
                    userdata.save();
                    var conf_link = app.get('site_path') + '/reset-password?reset_token=' + userdata.reset_token + '&user_key=' + userdata._id;
                    var mailOptions = {
                        from: 'rahulnagar8772@gmail.com',
                        to: userdata.email,
                        subject: 'Expertie | Password Reset',
                        html: 'Hello, ' + userdata.first_name + " " + userdata.last_name + ' <br><br> Please click on below link for reseting or generating new password.<br> <br> <a href="' + conf_link + '"> Reset password </a>'
                    };
                    Mail.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            throw err;
                        } else {
                            var json = {};
                            json['success'] = 1;
                            json['success_mess'] = "Please check your email";
                            json['result'] = userdata._id;
                            json['key'] = userdata.reset_token;
                            res.send(json);
                        }
                    });
                    var json = {};
                    json['success'] = 1;
                    json['success_mess'] = "Please check your email";
                    json['userdata'] = userdata;
                    res.send(json);
                } else {
                    var json = {};
                    json['error'] = 2;
                    json['error_mess'] = "this account does not exists";
                    res.send(json);

                }
            });
        }
    });

    app.get('/reset-password', function (req, res) {
        if (req.session.Auth) {
            res.redirect("/");
        }
        var reset_token = req.query.reset_token;
        var user_key = req.query.user_key;
        res.render('front/auth/resetpassword', { page_title: "Forget Password ", req: req, reset_token: reset_token, user_key: user_key });
    });

    app.post('/resetpassword/postdata', function (req, res) {
        req.check('password', 'Password is required').notEmpty().equals(req.body.conf_password);
        req.check('conf_password', 'Confirm password is required').notEmpty();
        req.check('reset_token', 'Reset token is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {

            var json = {};
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
            return;
        } else {

            var whereCond = {
                _id: req.body.user_key,
                reset_token: req.body.reset_token,
            };

            User.findOne(whereCond, function (err, userdata) {
                if (userdata) {
                    userdata.reset_token = "";
                    userdata.password = bcryptjs.hashSync(req.body.password, 10);
                    userdata.save();
                    var json = {};
                    json['success'] = 1;
                    json['success_mess'] = "password updated sucessfully!";
                    res.send(json);
                } else {
                    var json = {};
                    json['error'] = 2;
                    json['error_mess'] = "Token expired please try again !";
                    res.send(json);
                }
            });
        }
    });

    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.redirect('/');
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
