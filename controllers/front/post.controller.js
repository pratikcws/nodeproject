var mongoose = require('mongoose');
var checkLogin = require('../../config/checkLogin');
var Post = require('../../models/post');
var Offer = require('../../models/offer');
var Fav = require('../../models/fav');
var Comment = require('../../models/comment');
var ReviewRating = require('../../models/reviewrating');
var Messagehead = require('../../models/messagehead');
var Notification = require('../../models/notification');
var PaymentRequest = require('../../models/paymentrequest');
var Transaction = require('../../models/transaction');
var User = require('../../models/user');
var Availableamount = require('../../models/availableamount');
var Servicecharge = require('../../models/servicecharge');
var fs = require('fs');
var Config = require('../../config/config');
var iplocation = require("iplocation").default;


module.exports.controller = function (app) {
    /*expertie used codes */
    app.post('/post/postdata', function (req, res) {
        req.check('title', "This field is required").notEmpty().len(5, 45);
        req.check('description', 'This field is required').notEmpty();
        req.check('category', 'This field is required').notEmpty();

        // req.check('tasker_need', 'Tasker Need required').len(8, 15).isInt();
        req.check('person_type', 'This field is required').notEmpty();
        req.check('suburb', 'This field is required').notEmpty();
        req.check('due_date', 'This field is required').notEmpty();
        req.check('tasker_need', 'This field is required').notEmpty();
        req.check('budget', 'This field is required').notEmpty();


        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            var PostObj = new Post();
            PostObj.title = req.body.title;
            PostObj.category = req.body.category;
            PostObj.description = req.body.description;
            PostObj.make_an_offer = req.body.make_an_offer;
            PostObj.person_type = req.body.person_type;
            PostObj.suburb = req.body.suburb;
            PostObj.due_date = req.body.due_date;
            PostObj.tasker_need = req.body.tasker_need;
            PostObj.budget_type = "total";
            PostObj.budget = req.body.budget;
            PostObj.user_id = req.session.Auth._id;
            PostObj.budget = req.body.budget;
            PostObj.created_at = new Date();
            PostObj.updated_at = new Date();
            var lat = req.body.lat;
            var lng = req.body.lng;
            PostObj.location = [req.body.lng, req.body.lat];

            PostObj.save(function (err, PostObj) {
                if (err) {
                    res.send(err);
                }
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Record inserted successfully!";
                json['data'] = PostObj;
                res.send(json);
            });
        }
    });


    /*browse taks codes */
    app.get('/post/details/:id', function (req, res, next) {
        var id = req.params.id;
        var search_url = app.get('site_path')+"/post/details/"+id;
        var searchJson = {};
        var person_type = searchJson.person_type = req.query.person_type || "";
        searchJson.distance = req.query.distance || 50;
        var tasktype = searchJson.tasktype = req.query.tasktype || false;

        // var MyIP = "14.139.35.223";//req.connection.remoteAddress;
        // iplocation(MyIP).then((ipdata) => {
        // searchJson.location_data = {
        //     locaiton: ipdata.city + ", " + ipdata.region + ", " + ipdata.country,
        //     latitude: ipdata.latitude,
        //     longitude: ipdata.longitude,
        // }
        var location = req.query.location;
        if (location) {
            searchJson.location_data = {
                locaiton: req.query.location,
                latitude: req.query.lat,
                longitude: req.query.lng,
            }
        }
        // get the max distance or set it to 8 kilometers
        var conditionjson = {};
        if (location && location.length > 0) {
            var maxDistance = req.query.distance * 1000 || 50 * 1000;
            maxDistance /= 6371;
            var long = searchJson.location_data.longitude;
            var lat = searchJson.location_data.latitude;
            conditionjson.location = {
                $near: [long, lat],
                $maxDistance: maxDistance
            }
        } else {
            searchJson.location_data = {
                locaiton: '',
                latitude: '',
                longitude: '',

            }
        }
        if (person_type) {
            conditionjson.person_type = person_type;
        }
        if (tasktype) {
            conditionjson.awarded_to = null;
        }
        var whereCond = {
            $or: [
                conditionjson
            ],
            $and: [{
                status: { $ne: 3 }
            }]
        };
        Post.find(whereCond).populate('user_id').exec(function (err, posts) {
            Comment.find({ project_id: req.params.id }).populate('user_id').exec(function (err, commentdata) {
                Post.findOne({ _id: req.params.id }).populate('user_id').exec(function (err, data) {
                    Servicecharge.findOne({}).exec(function (err, servicecharge) {

                        if (!data) {
                            res.redirect('pages/404');
                        } else {

                            if (req.session.Auth) {
                                ReviewRating.findOne({ post_id: req.params.id, from_id: req.session.Auth._id }, function (err, reviewrating) {
                                    PaymentRequest.findOne({ post_id: req.params.id, from_user_id: req.session.Auth._id }, function (err, paymentrequest) {
                                        Offer.find({ project_id: req.params.id }).populate('user_id').exec(function (err, proposals) {
                                            if (err)
                                                throw err;

                                            Fav.findOne({ post_id: req.params.id, user_id: req.session.Auth._id }, function (err, favdata) {
                                                if (!favdata) {
                                                    var favdata = '';
                                                }

                                                Offer.findOne({ project_id: req.params.id, user_id: req.session.Auth._id }, function (err, cuurentusroffer) {
                                                    Offer.findOne({ project_id: req.params.id, status: 1 }, function (err, useroffer) {
                                                        if (!useroffer) {
                                                            var useroffer = '';
                                                        }
                                                        Transaction.findOne({ post_id: req.params.id }).exec(function (err, transdata) {
                                                            res.render('front/post/details', { page_title: data.title, role: true, active_tab: "post", cuurentusroffer: cuurentusroffer, data: data, posts: posts, req: req, slug: "", useroffer: useroffer, favdata: favdata, commentdata: commentdata, proposals: proposals, transdata: transdata, paymentrequest: paymentrequest, reviewrating: reviewrating, servicecharge: servicecharge, searchJson: searchJson, search_url:search_url });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            } else {
                                var useroffer = '';
                                var favdata = '';
                                var proposals = '';

                                res.render('front/post/details', { page_title: data.title, role: true, active_tab: "post", data: data, posts: posts, req: req, slug: "", useroffer: useroffer, favdata: favdata, commentdata: commentdata, proposals: proposals, servicecharge: servicecharge, searchJson: searchJson , search_url:search_url });

                            }

                        }
                    });
                });
            });
        });
        // });

    });
    /*end here */


    /*my task codes  */
    app.get('/post/my-task', checkLogin(), function (req, res, next) {
        userid = req.session.Auth._id;
        var search_url = app.get('site_path') + "/post/my-task";
        var searchJson = {};
        var person_type = searchJson.person_type = req.query.person_type || "";
        searchJson.distance = req.query.distance || 50;
        var tasktype = searchJson.tasktype = req.query.tasktype || false;

        // var MyIP = "14.139.35.223";//req.connection.remoteAddress;
        // iplocation(MyIP).then((ipdata) => {
        //     searchJson.location_data = {
        //         locaiton: ipdata.city + ", " + ipdata.region + ", " + ipdata.country,
        //         latitude: ipdata.latitude,
        //         longitude: ipdata.longitude,
        //     }
        var location = req.query.location;
        if (location) {
            searchJson.location_data = {
                locaiton: req.query.location,
                latitude: req.query.lat,
                longitude: req.query.lng,
            }
        }
        // get the max distance or set it to 8 kilometers
        var conditionjson = {};
        var max_d = req.query.distance || 50;
        if (location && location.length > 0) {
            var maxDistance = req.query.distance * 1000 || 50 * 1000;
            maxDistance /= 6371;
            var long = searchJson.location_data.longitude;
            var lat = searchJson.location_data.latitude;
            conditionjson.location = {
                $near: [long, lat],
                $maxDistance: maxDistance
            }
        } else {
            searchJson.location_data = {
                locaiton: '',
                latitude: '',
                longitude: '',

            }
        }
        if (person_type) {
            conditionjson.person_type = person_type;
        }
        if (tasktype) {
            conditionjson.awarded_to = null;
        }
        var whereCond = {
            $or: [
                conditionjson
            ],
            $and: [{
                status: { $ne: 3 },
                user_id: userid
            }]
        };

        Post.find(whereCond).populate('user_id').exec(function (err, browse_task) {
            res.render('front/post/browse_task', { page_title: "", role: true, active_tab: "post", browse_task: browse_task, data: "", req: req, slug: "my-task", useroffer: "", searchJson: searchJson, search_url:search_url });
        });
        //});
    });
    /*end here */


    app.get('/post/browse', function (req, res, next) {
        var search_url = app.get('site_path') + "/post/browse";
        var searchJson = {};
        var person_type = searchJson.person_type = req.query.person_type || "";
        searchJson.distance = req.query.distance || 50;
        var tasktype = searchJson.tasktype = req.query.tasktype || false;

        var MyIP = "14.139.35.223";//req.connection.remoteAddress;
        // iplocation(MyIP).then((ipdata) => {
        //     searchJson.location_data = {
        //         locaiton: ipdata.city + ", " + ipdata.region + ", " + ipdata.country,
        //         latitude: ipdata.latitude,
        //         longitude: ipdata.longitude,
        //     }
        var location = req.query.location;
        if (location) {
            searchJson.location_data = {
                locaiton: req.query.location,
                latitude: req.query.lat,
                longitude: req.query.lng,
            }
        }
        // get the max distance or set it to 8 kilometers
        var conditionjson = {};
        var max_d = req.query.distance || 50;
        if (location && location.length > 0) {
            var maxDistance = req.query.distance * 1000 || 50 * 1000;
            maxDistance /= 6371;
            var long = searchJson.location_data.longitude;
            var lat = searchJson.location_data.latitude;
            conditionjson.location = {
                $near: [long, lat],
                $maxDistance: maxDistance
            }
        } else {
            searchJson.location_data = {
                locaiton: '',
                latitude: '',
                longitude: '',

            }
        }
        if (person_type) {
            conditionjson.person_type = person_type;
        }
        if (tasktype) {
            conditionjson.awarded_to = null;
        }
        var whereCond = {
            $or: [
                conditionjson
            ],
            $and: [{
                status: { $ne: 3 }
            }]
        };
        Post.find(whereCond).populate('user_id').exec(function (err, browse_task) {
            if (err)
                throw err;
            if (!browse_task) {
                browse_task = [];
            }

            res.render('front/post/browse_task', { page_title: "My Post Page", req: req, browse_task: browse_task, data: "", searchJson: searchJson, search_url:search_url });
        })
        //});
    });

    app.post('/post/createoffer', checkLogin(), function (req, res, next) {
        req.check('offer_amount', "amount is required").notEmpty();
        req.check('offer_description', "Description is required").notEmpty();

        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            Offer.findOne({ _id: req.body.offer_id }, function (err, offer_details) {

                if (offer_details) {
                    if (err)
                        throw err;
                    offer_details.offer_amount = req.body.offer_amount;
                    offer_details.offer_description = req.body.offer_description;
                    offer_details.project_id = req.body.project_id;
                    offer_details.service_amount = req.body.service_amount;
                    offer_details.tasker_amount = req.body.tasker_amount;
                    offer_details.user_id = req.session.Auth._id;
                    offer_details.save(function (err, offer_details) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Your Offer Updated successfully !";
                        res.send(json);
                    });
                } else {
                    var Offerobj = new Offer();
                    Offerobj.offer_amount = req.body.offer_amount;
                    Offerobj.offer_description = req.body.offer_description;
                    Offerobj.project_id = req.body.project_id;
                    Offerobj.service_amount = req.body.service_amount;
                    Offerobj.tasker_amount = req.body.tasker_amount;
                    Offerobj.user_id = req.session.Auth._id;

                    /*set notification status 1= offer create*/
                    Notificationobj = new Notification();
                    Notificationobj.creator_id = req.session.Auth._id;
                    Notificationobj.reciever_id = req.body.postcreatedby;
                    Notificationobj.status = 0;
                    Notificationobj.project_id = req.body.project_id;
                    Notificationobj.save();
                    Offerobj.save(function (err, Offerobj) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;

                        json['success_mess'] = "Your Offer submit successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });



    app.post('/post/comment', checkLogin(), function (req, res, next) {
        req.check('comment', "This field is required").notEmpty();

        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            Comment.findOne({ _id: req.body.comment_id }, function (err, comments) {

                if (comments) {
                    if (err)
                        throw err;
                    comments.comment = req.body.comment;
                    comments.project_id = req.body.project_id;
                    comments.user_id = req.session.Auth._id;
                    comments.save(function (err, comments) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Your comment Updated successfully !";
                        res.send(json);
                    });
                } else {
                    if (req.files.comment_image) {
                        var sampleFile = req.files.comment_image;
                        var file = req.files.comment_image;
                        var tmp_path = file.path;
                        var fileName = file.name;
                        var file_ext = fileName.substr((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
                        var filename = Config.getRandomSalt() + '.' + file_ext;
                        sampleFile.mv('public/uploads/post/comment/' + filename);
                    }
                    var Commentobj = new Comment();
                    Commentobj.comment = req.body.comment;
                    Commentobj.project_id = req.body.project_id;
                    Commentobj.user_id = req.session.Auth._id;
                    if (req.files.comment_image) {
                        Commentobj.comment_image = filename;
                    }

                    console.log(Commentobj);

                    Commentobj.save(function (err, Commentobj) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Your comment submit successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });



    app.post('/post/messagehead', checkLogin(), function (req, res, next) {
        var json = {};
        var post_id = req.body.post_id;

        Messagehead.findOne({ project_id: post_id }).exec(function (err, data) {
            if (err)
                throw err;
            if (!data) {
                var Messageheadobj = new Messagehead();
                Messageheadobj.project_id = req.body.post_id;
                Messageheadobj.to_userid = req.body.to_userid;
                Messageheadobj.from_userid = req.body.from_userid;
                Messageheadobj.status = 1;
                Messageheadobj.save(function (err, messheaddata) {
                    if (err)
                        throw err;
                    var json = {};
                    json['success'] = 1;
                    json['message'] = "";
                    json['redirect_url'] = app.get('site_path') + '/account/message/' + messheaddata._id;
                    res.send(json);
                });
            } else {
                var json = {};
                json['success'] = 1;
                json['message'] = "";
                json['redirect_url'] = app.get('site_path') + '/account/message/' + data._id;
                res.send(json);
            }
        });

    });


    app.post('/post/awardproject', checkLogin(), function (req, res, next) {
        var json = {};
        Offer.findOne({ _id: req.body.offer_id }, function (err, offer) {
            if (offer) {
                if (err)
                    throw err;
                offer.status = req.body.status;
                offer.save(function (err, offer) {
                    if (err)
                        throw err;
                    var json = {};
                    json['success'] = 1;
                    if (offer.status == 1) {
                        Notificationobj = new Notification();
                        Notificationobj.creator_id = req.body.created_by;
                        Notificationobj.reciever_id = req.body.awarded_to;
                        Notificationobj.status = offer.status;
                        Notificationobj.project_id = req.body.post_id;
                        Notificationobj.save()
                        json['success_mess'] = "Award Successfully !";
                    } else if (offer.status == 2) {
                        Notificationobj = new Notification();
                        Notificationobj.creator_id = req.session.Auth._id;
                        Notificationobj.reciever_id = req.body.created_by;
                        Notificationobj.status = offer.status;
                        Notificationobj.project_id = req.body.post_id;
                        Notificationobj.save();

                        Post.findOne({ _id: req.body.post_id }, function (err, awardeduser) {
                            if (awardeduser) {
                                if (err)
                                    throw err;
                                awardeduser.awarded_to = req.body.awarded_to;
                                awardeduser.save()
                            }
                        });
                        json['success_mess'] = "Award accept successfully !";
                    } else if (offer.status == 3) {
                        Notificationobj = new Notification();
                        Notificationobj.creator_id = req.session.Auth._id;
                        Notificationobj.reciever_id = req.body.created_by;
                        Notificationobj.status = offer.status;
                        Notificationobj.project_id = req.body.post_id;
                        Notificationobj.save();


                        Post.findOne({ _id: req.body.post_id }, function (err, awardeduser) {
                            if (awardeduser) {
                                if (err)
                                    throw err;
                                awardeduser.awarded_to = "";
                                awardeduser.save()
                            }
                        });
                        json['success_mess'] = "You Rejected Award !";

                    } else {
                        json['success_mess'] = "successfully !";
                    }

                    res.send(json);
                });
                if (offer.status == 2) {
                    Availableamountobj = new Availableamount();
                    Availableamountobj.user_id = req.session.Auth._id;
                    Availableamountobj.post_id = req.body.post_id;
                    Availableamountobj.amount = req.body.servicecharge;
                    Availableamountobj.payment_type = 2;
                    Availableamountobj.save()

                    User.findOne({ _id: req.session.Auth._id }, function (err, user) {
                        if (user) {
                            if (err)
                                throw err;
                            var balance = user.available_balance - req.body.servicecharge;
                            user.available_balance = balance;
                            user.save(function (err, newuser) {
                                if (err)
                                    throw err;

                                console.log(newuser);
                            })
                        }
                    });
                }

            }
        });
    });

    

    app.post('/post/addFavlist', function (req, res) {
        var post_id = req.body.post_id;
        var user_id = req.session.Auth._id;
        Fav.findOne({ post_id: post_id, user_id: user_id }, function (err, favdata) {
            if (err)
                throw err;

            if (!favdata) {
                var favObj = new Fav();
                favObj.post_id = post_id;
                favObj.user_id = user_id;
                favObj.save(function (err, data) {
                    var json = {};
                    json['success'] = 1;
                    json['success_mess'] = "Record inserted successfully!";
                    json['data'] = data;
                    res.send(json);
                });
            } else {
                favdata.post_id = post_id;
                favdata.user_id = user_id;
                favdata.save(function (err, data) {
                    var json = {};
                    json['success'] = 1;
                    json['success_mess'] = "Record updated successfully!";
                    json['data'] = data;
                    res.send(json);
                });
            }
        });

    });


    app.post('/post/paymentRequest', function (req, res) {

        var paymentReqObj = new PaymentRequest();
        paymentReqObj.to_user_id = req.body.to_userid;
        paymentReqObj.from_user_id = req.session.Auth._id;
        paymentReqObj.post_id = req.body.post_id;

        /*set notification status 5 = payment Request created*/
        Notificationobj = new Notification();
        Notificationobj.creator_id = req.body.to_userid;
        Notificationobj.reciever_id = req.body.user_id;
        Notificationobj.status = 5;
        Notificationobj.project_id = req.body.post_id;
        Notificationobj.save()

        paymentReqObj.save(function (err, data) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "Payment Requested successfully";
            json['data'] = data;
            res.send(json);

        });

    });
};
