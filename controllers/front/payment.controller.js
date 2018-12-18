var mongoose = require('mongoose');
var Config = require('../../config/config');
var Transaction = require('../../models/transaction');
var Servicecharge = require('../../models/servicecharge');
var Availableamount = require('../../models/availableamount');
var Offer = require('../../models/offer');
var User = require('../../models/user');
var Post = require('../../models/post');
var Award = require('../../models/award');
var paypal = require('paypal-rest-sdk');
var ipn = require('paypal-ipn');

paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'Afo_gvrtIi0ZTiwJtWaCn0OArazVrVus4hkIGuQckL9sAKm-jQws_IXgLr_sn7ucIgdmB0Orzcgx_lup', // please provide your client id here 
    'client_secret': 'ECQZOL8CmSLH4mhHJ9ccHPximZgAaZO8dcVC-oujip6ian1kjWe6ONr4HBWlhGBw3CFVl2IbCy_g8tt9' // provide your client secret here 
});



module.exports.controller = function (app) {

    app.post('/paynow', function (req, res) {
        var returnurl = req.app.get('site_path') + "/account/payment/success";
        var cancelurl = req.app.get('site_path') + "/payment/cancel";
        Post.findOne({ _id: req.body.post_id }).exec(function (err, data) {

            if (err)
                throw err;
            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },

                "redirect_urls": {
                    "return_url": returnurl,
                    "cancel_url": cancelurl
                },

                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": data.title,
                            "sku": data.title,
                            "price": req.body.total_amount,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": req.body.total_amount
                    },
                    custom: data._id,

                    "description": data.description
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error)
                    throw error;
                res.redirect(payment.links[1].href);
            });

        });

    });

    app.all('/account/payment/success', function (req, res) {
        var paymentId = req.query.paymentId;
        var payerId = req.query.PayerID;
        var details = { "payer_id": payerId };
        paypal.payment.execute(paymentId, details, function (error, payment) {
            if (error)
                throw error;
            Post.findOne({ _id: payment.transactions[0].custom }).exec(function (err, postdata) {
                var transObj = new Transaction();
                transObj.user_id = req.session.Auth._id;
                transObj.post_id = payment.transactions[0].custom;
                transObj.payment_to = postdata.awarded_to;
                transObj.trans_id = payment.id;
                transObj.amount = payment.transactions[0].amount.total;
                transObj.payment_mode = payment.payment_method;
                transObj.payment_type = 'paypal';
                transObj.payment_status = (payment.payer.status == 'VERIFIED') ? 1 : 0;
                transObj.payment_date = payment.transactions[0].related_resources[0].create_time;
                transObj.save(function (err, data) {
                    if (err)
                        throw err;
                    if (data) {
                        postdata.status = 3;
                        postdata.save();
                        res.redirect('/payment/success/trans/' + transObj._id);
                    }
                });
               
                /*debit entry */
                var availableamountObj = new Availableamount(); 
                availableamountObj.amount = payment.transactions[0].amount.total;
                availableamountObj.post_id = payment.transactions[0].custom;
                availableamountObj.user_id = req.session.Auth._id;
                availableamountObj.payment_type = 2; 

                availableamountObj.save();

                /*credit entry */
                var availableamountcObj = new Availableamount(); 
                availableamountcObj.amount = payment.transactions[0].amount.total;
                availableamountcObj.post_id = payment.transactions[0].custom;
                availableamountcObj.user_id = postdata.awarded_to;
                availableamountcObj.payment_type = 1; 

                availableamountcObj.save();

                
                 
                Offer.findOne({ user_id: postdata.awarded_to , project_id : payment.transactions[0].custom }).exec(function (err, offerdata) {  
                User.findOne({ _id: postdata.awarded_to }).exec(function (err, userdata) {  
                    userdata.available_balance= parseInt(userdata.available_balance ) + parseInt(offerdata.offer_amount);
                    userdata.save();
                });
                });
            });
        });
    });

    app.get('/payment/success/trans/:trans_id', function (req, res) {
        var trans_id = req.params.trans_id;
        Transaction.findOne({ _id: trans_id }).exec(function (err, data) {
            if (err)
                throw err;
            res.render('front/payment/success', {
                page_title: 'Payment Success',
                req: req,
                transdata: data
            });
        });
    });

    app.get('/payment/cancel', function (req, res) {
        res.render('front/payment/failed', {
            page_title: 'Payment Failed',
            req: req
        });

    });

    app.get('/post/complete/payment/:id', function (req, res) {
        var id = req.params.id;
        Post.findOne({ _id: id }).populate('user_id').exec(function (err, postdata) {
            Offer.findOne({ user_id: postdata.awarded_to, project_id: id }).populate('user_id').exec(function (err, offer) {
                Servicecharge.findOne({}).exec(function (err, servicechrge) {

                    res.render('front/transaction/make_payment', {
                        page_title: 'Payment Details ',
                        req: req, postdata: postdata, servicechrge: servicechrge, offer: offer
                    });
                });
            });
        });
    });
};
