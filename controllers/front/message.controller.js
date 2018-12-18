var mongoose = require('mongoose');
var User = require('../../models/user');
var Config = require('../../config/config');
var Messagehead = require('../../models/messagehead');
var Message = require('../../models/message');
var Transaction = require('../../models/transaction');
var ReviewRating = require('../../models/reviewrating');
var checkLogin = require('../../config/checkLogin');

module.exports.controller = function (app) {
    //checkLogin(),
    app.get('/account/message',checkLogin(),function (req, res, next) {
		 var user_id = req.session.Auth._id;
         Messagehead.find({$or: [{'to_userid': user_id}, {'from_userid': user_id}]}).populate('project_id').populate('from_userid').populate('to_userid').exec(function (err, projects){
		res.render('front/messages/index', {page_title: "Messages", req: req, projects: projects});
    });
    });

    app.get('/account/message/:msghead_id?', checkLogin(), function (req, res, next) {
        var user_id = req.session.Auth._id;
        var msghead_id = req.params.msghead_id;
        Messagehead.find({$or: [{'to_userid': user_id}, {'from_userid': user_id}]}).populate('project_id').populate('from_userid').populate('to_userid').exec(function (err, projects) {
            Message.find({msg_head_id: msghead_id}).populate('from_user_id').populate('to_user_id').exec(function (err, messages) {
                if (!messages) {
                    var messages = '';
                }
                Messagehead.findOne({_id: msghead_id}).populate('project_id').populate('from_userid').populate('to_userid').exec(function (err, projectdetail) {
                    if (!projects) {
                        res.redirect('pages/404');
                    } else {
                        if (err)
                            throw err;
                        Transaction.findOne({post_id:projectdetail.project_id}).exec(function (err, transdata) {
                        ReviewRating.findOne({post_id:projectdetail.project_id}).exec(function (err, reviews) {
                       		res.render('front/messages/index', {
                       			page_title: "Messages", 
                       			req: req, 
                       			projects: projects, 
                       			messages: messages, 
                       			projectdetail: projectdetail,
                       			transdata:transdata,
								reviews:reviews

                       		});
                    	});
					  });
                    }
                });
            });
        });
    });
  


    app.post('/account/projectmessages', checkLogin(), function (req, res, next) {
        var json = {};
        var MessageObj = new Message();
        MessageObj.project_id = req.body.project_id;
        MessageObj.from_user_id = req.body.from_user_id;
        MessageObj.msg_head_id = req.body.msg_head_id;
        MessageObj.to_user_id = req.body.to_user_id;
        MessageObj.message = req.body.message;
        MessageObj.status = 1;

        MessageObj.save(function (err, MessageObj) {
            if (err)
                throw err;
            var json = {};
            json['success'] = 1;
            json['success_mess'] = "Your message sent successfully !";
            res.send(json);
        });


    });


};