var Skill = require('../../models/skill');
var PaymentMethod = require('../../models/paymentmethod');
var User = require('../../models/user');
var Availableamount = require('../../models/availableamount');
var Portfolio = require('../../models/portfolio');
var ReviewRating = require('../../models/reviewrating');
var Bankaccountdetails = require('../../models/bankaccountdetails');
var Billingaddress = require('../../models/billingaddress');
var checkLogin = require('../../config/checkLogin');
var FundRequest = require('../../models/fundrequest');

module.exports.controller = function (app) {

    app.get('/user/account/varification', function (req, res) {
        res.render('front/user/account_varification', { page_title: "Account Varification", req: req });
    });

    app.get('/profile/:username/:userid', function (req, res, next) {
        var user_id = req.params.userid;
        ReviewRating.find({ to_id: user_id }).populate('to_id').populate('from_id').populate('post_id').exec(function (err, userreviews) {
            Portfolio.find({ user_id: user_id }).exec(function (err, portfolio) {
                PaymentMethod.findOne({ user_id: user_id }).exec(function (err, paymentmethod) {
                    User.findOne({ _id: user_id }).exec(function (err, data) {
                        Skill.findOne({ user: user_id }).exec(function (err, skill) {
                            if (err)
                                throw err;
                            res.render('front/profile/index', { page_title: "My Post Page", req: req, data: data, paymentmethod: paymentmethod, portfolio: portfolio, skill: skill, userreviews: userreviews });
                        });
                    });
                });
            });
        });

    });

    app.get('/user/fundrequest', checkLogin(), function (req, res) {
        Bankaccountdetails.findOne({ user_id: req.session.Auth._id }).exec(function (err, bankaccountdetails) {
            // FundRequest.find({ user_id: req.session.Auth._id,status:1 }).exec(function (err, fundrequest) {
            
            Billingaddress.findOne({ user_id: req.session.Auth._id }).exec(function (err, billingaddress) {
                User.findOne({ _id: req.session.Auth._id }).exec(function (err, userdata) {
                    res.render('front/user/fundrequest', { page_title: "Fund Request", req: req, userdata: userdata, bankaccountdetails: bankaccountdetails, billingaddress: billingaddress });
                });
            });
        // });
        });
    });


    
    app.post('/user/releasefundrequest', checkLogin(), function (req, res, next) {
        var json = {};
        var FundRequestObj = new FundRequest();
        FundRequestObj.acc_number = req.body.acc_number;
        FundRequestObj.bsb = req.body.bsb;
        FundRequestObj.acc_holder_name = req.body.acc_holder_name;
        FundRequestObj.address1 = req.body.address1;
        FundRequestObj.address2 = req.body.address2;
        FundRequestObj.country = req.body.country;
        FundRequestObj.state = req.body.state;
        FundRequestObj.city = req.body.city;
        FundRequestObj.postcode =  req.body.postcode;
        FundRequestObj.user_id =  req.body.user_id;
        FundRequestObj.status =  1;
        FundRequestObj.user_id = req.session.Auth._id;
        FundRequestObj.amount = req.body.req_amount;

        
        User.findOne({ _id: req.session.Auth._id }, function (err, user) {

            if (user) {
                if (err)
                    throw err;
                user.available_balance = user.available_balance-req.body.req_amount;
                user.save(function (err, user) {
                    if (err)
                        throw err;
                    
                });
            } 
        });
        var AvailableamountObj = new Availableamount();
        AvailableamountObj.amount = req.body.req_amount;
        AvailableamountObj.user_id = req.session.Auth._id;
        AvailableamountObj.payment_type = 2; //debit
        AvailableamountObj.comment = 1; //debit- payment release
        AvailableamountObj.save(function (err, Offerobj) {
            if (err)
                throw err;
            
        });


        FundRequestObj.save(function (err, FundRequestObj) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "Your Request sent successfully !";
            res.send(json);
        });


    

});

}
