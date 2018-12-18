var bcrypt = require('bcryptjs');
var bcryptjs = require('bcryptjs');
var User = require('../../models/user');
var Portfolio = require('../../models/portfolio');
var PaymentMethod = require('../../models/paymentmethod');
var BillingAddress = require('../../models/billingaddress');
var BankAccountDetails = require('../../models/bankaccountdetails');
var Post = require('../../models/post');
var Notification = require('../../models/notification');
var Skill = require('../../models/skill');
var Message = require('../../models/message');
var Fav = require('../../models/fav');
var Offer = require('../../models/offer');
var Transaction = require('../../models/transaction');
var Messagehead = require('../../models/messagehead');
var Transaction = require('../../models/transaction');
var Category = require('../../models/category');
var Availableamount = require('../../models/availableamount');
var checkLogin = require('../../config/checkLogin');
var fs = require('fs');
var http = require('http');
var Config = require('../../config/config');
var request = require("request");

module.exports.controller = function (app) {

    app.get('/account', checkLogin(), function (req, res, next) {
        // userid= req.session.Auth._id || "" ;
        Category.find().exec(function (err, catdata) {
            if (err)
                throw err;
            Notification.find({ reciever_id: req.session.Auth._id }).populate('creator_id').populate('reciever_id').populate('project_id').exec(function (err, notifdata) {
                Message.find({ to_user_id: req.session.Auth._id }).populate('from_user_id').populate('project_id').limit(5).exec(function (err, message) {
                    if (err)
                        throw err;
                    res.render('front/dashboard/index', {
                        page_title: "Our Story",
                        req: req,
                        catdata: catdata,
                        notifdata: notifdata,
                        message: message,
                        active_nav: 'dashboard'
                    });
                });
            });
        });

    });

    app.get('/account/my-posts', checkLogin(), function (req, res, next) {
        Post.find({ user_id: req.session.Auth._id }, function (err, data) {
            res.render('front/post/my_post', { page_title: "My Post Page", req: req, data: data, active_nav: 'mytask' });
        })
    });

    app.get('/account/skill', checkLogin(), function (req, res, next) {
        Skill.findOne({ user: req.session.Auth._id || "" }, function (err, skilldata) {

            if (err)
                throw err;
            res.render('front/user/skill', { page_title: "My Skill", req: req, skilldata: skilldata });
        });
    });

    app.get('/account/addtask/:catid?', checkLogin(), function (req, res, next) {
        var catid = req.params.catid;
        if (catid) {
            Category.findOne({ _id: req.params.catid || "" }).exec(function (err, result) {
                res.render('front/post/index', { page_title: "My Post Page", req: req, data: result });
            })
        } else {
            Category.find({}).exec(function (err, categories) {
                res.render('front/post/index', { page_title: "My Post Page", req: req, data: "", categories: categories });
            });
        }
    });

    /* --------------- Badges Section ------------------*/

    app.get('/account/badge', checkLogin(), function (req, res, next) {
        PaymentMethod.findOne({ user_id: req.session.Auth._id }, function (err, paymentverify) {
            User.findOne({ _id: req.session.Auth._id }, function (err, bagdedata) {
                res.render('front/user/badge', { page_title: "Badges Page", req: req, bagdedata: bagdedata, paymentverify: paymentverify });
            });
        });
    });

    /*---------------- Profile Section -----------------*/

    app.get('/account/profile', checkLogin(), function (req, res, next) {
        User.findOne({ _id: req.session.Auth._id }, function (err, userdata) {
            res.render('front/user/profile', { page_title: "Profile Page", req: req, userdata: userdata });
        });
    });



    app.get('/account/referfriend', checkLogin(), function (req, res, next) {
        userid = req.session.Auth._id || "";

        res.render('front/user/referfriend', { page_title: "referfriend Page", req: req, userdata: userid, active_nav: 'refer-a-friend' });

    });


    app.post('/account/payment_method', checkLogin(), function (req, res, next) {
        req.check('card_number', "card number is required").notEmpty();
        req.check('exp_date', "Expiry date is required").notEmpty();
        req.check('cvc', "cvc is required").notEmpty();


        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            PaymentMethod.findOne({ _id: req.body.payment_id }, function (err, payment_method) {

                if (payment_method) {
                    if (err)
                        throw err;
                    payment_method.card_number = req.body.card_number;
                    payment_method.exp_date = req.body.exp_date;
                    payment_method.cvc = req.body.cvc;
                    payment_method.user_id = req.session.Auth._id;

                    payment_method.save(function (err, payment_method) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Payment Method Updated successfully !";
                        res.send(json);
                    });
                } else {
                    var PaymentMethodobj = new PaymentMethod();
                    PaymentMethodobj.card_number = req.body.card_number;
                    PaymentMethodobj.exp_date = req.body.exp_date;
                    PaymentMethodobj.cvc = req.body.cvc;
                    PaymentMethodobj.user_id = req.session.Auth._id;

                    PaymentMethodobj.save(function (err, PaymentMethodobj) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;

                        json['success_mess'] = "Payment Method Added successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });



    app.post('/account/billing_Address', checkLogin(), function (req, res, next) {
        req.check('address1', "Address is required").notEmpty();
        req.check('city', "City is required").notEmpty();
        req.check('state', "State is required").notEmpty();
        req.check('postcode', "Postcode is required").notEmpty();
        req.check('country', "Country is required").notEmpty();


        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            BillingAddress.findOne({ _id: req.body.billing_id }, function (err, BillAddress) {

                if (BillAddress) {
                    if (err)
                        throw err;
                    BillAddress.address1 = req.body.address1;
                    BillAddress.address2 = req.body.address2;
                    BillAddress.city = req.body.city;
                    BillAddress.state = req.body.state;
                    BillAddress.postcode = req.body.postcode;
                    BillAddress.country = req.body.country;
                    BillAddress.user_id = req.session.Auth._id;

                    BillAddress.save(function (err, BillAddress) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Billing Address Updated successfully !";
                        res.send(json);
                    });
                } else {
                    var BillingAddressobj = new BillingAddress();
                    BillingAddressobj.address1 = req.body.address1;
                    BillingAddressobj.address2 = req.body.address2;
                    BillingAddressobj.city = req.body.city;
                    BillingAddressobj.state = req.body.state;
                    BillingAddressobj.postcode = req.body.postcode;
                    BillingAddressobj.country = req.body.country;
                    BillingAddressobj.user_id = req.session.Auth._id;

                    BillingAddressobj.save(function (err, BillingAddressobj) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;

                        json['success_mess'] = "Billing Address Added successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });



    app.post('/account/bank_account_detials', checkLogin(), function (req, res, next) {
        req.check('acc_holder_name', "Name is required").notEmpty();
        req.check('bsb', "BSB is required").notEmpty();
        req.check('acc_number', "Account number is required").notEmpty();



        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            BankAccountDetails.findOne({ _id: req.body.account_id }, function (err, Bankdetials) {

                if (Bankdetials) {
                    if (err)
                        throw err;
                    Bankdetials.acc_holder_name = req.body.acc_holder_name;
                    Bankdetials.bsb = req.body.bsb;
                    Bankdetials.acc_number = req.body.acc_number;
                    Bankdetials.user_id = req.session.Auth._id;

                    Bankdetials.save(function (err, Bankdetials) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Bank Detials Updated successfully !";
                        res.send(json);
                    });
                } else {
                    var Bankdetialsobj = new BankAccountDetails();
                    Bankdetialsobj.acc_holder_name = req.body.acc_holder_name;
                    Bankdetialsobj.bsb = req.body.bsb;
                    Bankdetialsobj.acc_number = req.body.acc_number;
                    Bankdetialsobj.user_id = req.session.Auth._id;

                    Bankdetialsobj.save(function (err, Bankdetialsobj) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;

                        json['success_mess'] = "Bank Detials Added successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });



    app.post('/account/addprofile', checkLogin(), function (req, res, next) {
        req.check('first_name', "first name is required").notEmpty();
        req.check('first_name', "Not a valid input").isAlpha();
        req.check('last_name', "last name is required").notEmpty();
        req.check('last_name', "Not a valid input").isAlpha();
        req.check('email', "Email is required").isEmail();
        // req.check('mobile_no', "Mobile number is required").notEmpty();
        req.check('tagline', "tagline is required").notEmpty();
        
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {

            User.findOne({ _id: req.body.user_id }, function (err, userdata) {
                if (req.files.cover) {
                    var sampleFile = req.files.cover;
                    var file = req.files.cover;
                    var tmp_path = file.path;
                    var avfileName = file.name;
                    var file_ext = avfileName.substr((Math.max(0, avfileName.lastIndexOf(".")) || Infinity) + 1);
                    var avfileName = Config.getRandomSalt() + '.' + file_ext;
                    sampleFile.mv('public/uploads/user/cover/' + avfileName);
                }
                if (req.files.user_image) {
                    var sampleFile = req.files.user_image;
                    var file = req.files.user_image;
                    var tmp_path = file.path;
                    var fileName = file.name;
                    var file_ext = fileName.substr((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
                    var filename = Config.getRandomSalt() + '.' + file_ext;
                    sampleFile.mv('public/uploads/user/profile/' + filename);
                }

                if (userdata) {
                    if (err)
                        throw err;
                    userdata.first_name = req.body.first_name;
                    userdata.last_name = req.body.last_name;
                    userdata.email = req.body.email;
                    // userdata.mobile_no = req.body.mobile_no;
                    userdata.tagline = req.body.tagline;
                    userdata.abn = req.body.abn;
                    userdata.location = req.body.location;
                    userdata.city = req.body.city;
                    userdata.lat = req.body.lat;
                    userdata.lng = req.body.lng;

                    userdata.birthday = req.body.birthday;
                    userdata.description = req.body.description;
                    userdata.post_task = req.body.post_task;
                    userdata.earn_money = req.body.earn_money;
                    if (req.files.cover) {
                        userdata.cover = avfileName;
                    }
                    if (req.files.user_image) {
                        userdata.user_image = filename;
                    }
                    userdata.save(function (err, userdata) {
                        if (err)
                            throw err;
                        var json = {};
                        req.session.Auth = userdata;

                        json['success'] = 1;
                        json['success_mess'] = "Profile Updated successfully !";
                        res.send(json);

                    });
                }
            });

        }
       

    });

    /*---------------- Profile Section -----------------*/

    app.get('/account/my-fav-post', checkLogin(), function (req, res, next) {
        var user_id = req.session.Auth._id;
        Fav.find({ user_id: user_id }).populate('post_id').exec(function (err, favdata) {
            if (err)
                throw err;
            res.render('front/post/fav_post', { page_title: "My Post Page", req: req, favdata: favdata, active_nav: 'favourites' });
        });
    });


    app.get('/account/appliedoffer', checkLogin(), function (req, res, next) {
        var user_id = req.session.Auth._id;
        Offer.find({ user_id: user_id }).populate('project_id').exec(function (err, applied) {
            if (err)
                throw err;
            res.render('front/post/applied_offer', { page_title: "My Post Page", req: req, applied: applied, active_nav: 'applied_porject' });
        });
    });

    app.get('/account/my-messages', checkLogin(), function (req, res, next) {
        res.render('front/messages/index', { page_title: "My Post Page", req: req });
    });

    app.get('/account/my-transaction', checkLogin(), function (req, res, next) {
        Transaction.find({}, function (err, data) {
            res.render('front/transaction/index', { page_title: "My Post Page", req: req, data: data });
        })
    });

    app.get('/account/change-password', checkLogin(), function (req, res, next) {
        res.render('front/user/change-password', { page_title: "Change Password", req: req });
    });

    app.get('/account/payment-methods', checkLogin(), function (req, res, next) {
        var user_id = req.session.Auth._id;
        PaymentMethod.findOne({ user_id: user_id }, function (err, paymentdata) {
            BillingAddress.findOne({ user_id: user_id }, function (err, billingdata) {
                BankAccountDetails.findOne({ user_id: user_id }, function (err, account_details) {
                    res.render('front/user/payment-methods', { page_title: "payment methods", req: req, data: paymentdata, billingdata: billingdata, account_details: account_details, active_nav: "payment-methods" });
                });
            });
        });
    });


    app.get('/account/payment-history', checkLogin(), function (req, res, next) {

        var user_id = req.session.Auth._id;
        User.findOne({ _id: user_id }, function (err, availableamount) {
            Availableamount.find({ user_id: user_id, payment_type: 1 }, function (err, credit) {
                Availableamount.find({ user_id: user_id, payment_type: 2 }, function (err, debit) {
                    res.render('front/user/payment-history', { page_title: "payment methods", req: req, active_nav: "payment-history", availableamount: availableamount, credit: credit, debit: debit });
                });
            });
        });
    });




    app.post('/account/change-password', checkLogin(), function (req, res, next) {
        req.check('old_password', 'Old Password is required').notEmpty();
        req.check('new_password', 'New Password is required').notEmpty();
        req.check('conf_password', 'Confirm Password is required').notEmpty().equals(req.body.conf_password);
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            User.findOne({ _id: req.session.Auth._id }, function (err, userdata) {
                if (err)
                    throw err;
                if (!userdata) {
                    json['error'] = 2;
                    json['error_mess'] = "Unknow User Please try Again";
                    res.send(json);
                } else {
                    bcrypt.compare(req.body.old_password, userdata.password, function (err, matchpass) {
                        if (err)
                            throw err;
                        if (matchpass) {
                            var json = {};
                            userdata.password = bcryptjs.hashSync(req.body.new_password, 10);
                            userdata.save(function (err, udata) {
                                json['success'] = 1;
                                json['success_mess'] = "Password Changes successfully !";
                                json['userdata'] = udata;
                                res.send(json);
                            });
                        } else {
                            var json = {};
                            json['error'] = 2;
                            json['error_mess'] = "Old password does not match !";
                            res.send(json);
                        }
                    });
                }
            });
        }
    });

    /* Skill Submit by trapti */

    app.post('/account/skill_add', checkLogin(), function (req, res, next) {
        req.check('good_at', "This field is required").notEmpty();

        req.check('qualification', "Qualification is required").notEmpty();
        req.check('experience', "Experience is required").notEmpty();
        req.check('languages', "Languages is required").notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {

            Skill.findOne({ user: req.session.Auth._id }, function (err, skilldata) {
                if (err)
                    throw err;
                if (skilldata != null) {

                    skilldata.good_at = req.body.good_at;
                    skilldata.user = req.session.Auth._id;
                    skilldata.get_around = req.body.get_around;
                    skilldata.qualification = req.body.qualification;
                    skilldata.languages = req.body.languages;
                    skilldata.experience = req.body.experience;
                    skilldata.save(function (err, skilldata) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Skills Updated successfully !";
                        res.send(json);
                    });
                } else {
                    var skillobj = new Skill();

                    skillobj.good_at = req.body.good_at;
                    skillobj.user = req.session.Auth._id;
                    skillobj.get_around = req.body.get_around;
                    skillobj.qualification = req.body.qualification;
                    skillobj.languages = req.body.languages;
                    skillobj.experience = req.body.experience;

                    skillobj.save(function (err, skillobj) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        //json['skillobj'] = skilldata;
                        json['success_mess'] = "Skills Inserted successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });

    /* Skill Submit by trapti */

    app.post('/account/profile/useravatar', checkLogin(), function (req, res, next) {
        // console.log(req.files.user_image);
    });


    app.get('/account/taskalertkeyword', checkLogin(), function (req, res, next) {
        res.render('front/settings/task-alert-keyword', { page_title: "payment methods", req: req });
    });

    app.get('/account/notif-settings', checkLogin(), function (req, res, next) {
        res.render('front/settings/notif-settings', { page_title: "payment methods", req: req });
    });

    app.get('/account/mobile-settings', checkLogin(), function (req, res, next) {
        res.render('front/settings/mobile-settings', { page_title: "payment methods", req: req });
    });

    app.get('/account/my-portfolio', checkLogin(), function (req, res, next) {
        Portfolio.find({ user_id: req.session.Auth._id }, function (err, portdata) {
            res.render('front/settings/my-portfolio', { page_title: "payment methods", req: req, portdata: portdata });
        });
    });

    app.get('/account/my-notification', checkLogin(), function (req, res, next) {
        Notification.find({ reciever_id: req.session.Auth._id }).populate('creator_id').populate('reciever_id').populate('project_id').exec(function (err, data) {

            res.render('front/notification/notif', { page_title: "Notification", req: req, data: data, active_nav: 'notification' });
        });
    });

    app.post('/account/portfolio/addnew', checkLogin(), function (req, res, next) {
        //req.check('portfolio', "Image is required").notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
        } else {
            var filename = '';

            if (req.files.image) {

                var sampleFile = req.files.image;
                var file = req.files.image;
                var tmp_path = file.path;
                var fileName = file.name;
                var file_ext = fileName.substr((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
                var filename = Config.getRandomSalt() + '.' + file_ext;
                sampleFile.mv('public/uploads/portfolio/' + filename);
            }


            if (req.body.portfolio_id != "undefined" && req.body.portfolio_id.length == 0) {
                portObj = new Portfolio();

                portObj.user_id = req.session.Auth._id;
                portObj.image = filename;
               
                portObj.save();
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Record inserted successfully!";
                json['portdata'] = portObj;
                res.send(json);
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
        }
        res.send(json);
    });


    app.post('/account/mobileverification', checkLogin(), function (req, res, next) {
        req.check('mobile', "mobile is required").notEmpty();

        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {

            User.findOne({ _id: req.session.Auth._id }, function (err, userdata) {
                var new_opt = Math.floor(1000 + Math.random() * 9000);
                if (userdata) {
                    if (err)
                        throw err;
                    userdata.mobile = req.body.mobile;
                    userdata.otp = new_opt;
                    userdata.mobile_verify = 0;
                    userdata.save(function (err, userdata) {
                        if (err)
                            throw err;

                        /** SMS SENDING **/
                        var options = {
                            method: 'POST',
                            url: 'https://my.smscentral.com.au/api/v3.2',
                            headers:
                            {
                                // 'postman-token': 'ea1c7761-8b65-34e2-57cf-7b64827f17ab',
                                'cache-control': 'no-cache',
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            form:
                            {
                                USERNAME: 'benstefanescu@yahoo.com.au',
                                PASSWORD: 'Letmein100*',
                                ACTION: 'send',
                                ORIGINATOR: 'expertie',
                                RECIPIENT: req.body.mobile,
                                MESSAGE_TEXT: "OTP-" + new_opt
                            }
                        };

                        request(options, function (error, response, body) {
                            if (error) throw new Error(error);
                            var json = {};
                            json['success'] = 1;
                            json['success_mess'] = "otp sent successfully !";
                            res.send(json);
                        });

                        /** SMS SENDING **/

                    });


                }
            });
        }

    });





    app.post('/account/otp', checkLogin(), function (req, res, next) {
        req.check('otp', "this field is required").notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            User.findOne({ _id: req.session.Auth._id, otp: req.body.otp }, function (err, userdata) {
                if (err)
                    throw err;
                if (userdata) {
                    userdata.mobile_verify = 1;
                    userdata.otp = "";
                    userdata.save(function (err, newuserdata) {
                        if (err)
                            throw err;
                        req.session.Auth = newuserdata;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "your mobile number verified successfully !";
                        res.send(json);

                    });
                } else {

                    var json = {};
                    json['error'] = 1;
                    json['error_mess'] = "Something went wrong. Please try again";
                    res.send(json);
                }

            });
        }
    });



    app.post('/account/portfolio/deleteportfolio', checkLogin(), function (req, res, next) {
        Portfolio.findOne({ _id: req.body.portfolio_id }, function (err, portdata) {
            if (err)
                throw err;
            var json = {};
            if (portdata) {
                fs.unlink('public/uploads/portfolio/' + portdata.image, function (err) {

                });
                // portdata.image =  filename;
                portdata.remove();
                portdata.save();
                json['success'] = 1;
                json['success_mess'] = "Delete Records successfully !";
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
            res.send(json);
        });
    });


    app.post('/account/portfolio/uploadresume', checkLogin(), function (req, res, next) {
        var filename = '';
        if (req.files.resume) {
            var sampleFile = req.files.resume;
            var file = req.files.resume;
            var tmp_path = file.path;
            var fileName = file.name;
            var file_ext = fileName.substr((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
            var filename = Config.getRandomSalt() + '.' + file_ext;
            sampleFile.mv('public/uploads/resumes/' + filename);
        }
        if (filename.length > 0) {
            User.findOne({ _id: req.session.Auth._id }, function (err, userdata) {
                if (err)
                    throw err;

                userdata.user_resume = filename;
                userdata.save(function (err, newuserdata) {
                    req.session.Auth = newuserdata;
                    var json = {};
                    json['success'] = 1;
                    json['success_mess'] = "Resume Uploaded Successfully";
                    json['userdata'] = newuserdata;
                    res.send(json);
                });
            });
        } else {
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "Resume Uploaded Successfully";
            json['userdata'] = newuserdata;
            res.send(json);
        }
    });
};


