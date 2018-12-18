var Post = require('../../models/post');
var User = require('../../models/user');
var ReviewRating = require('../../models/reviewrating');
var Notification = require('../../models/notification');
var Award = require('../../models/award');
var mongoose = require('mongoose');
var checkLogin = require('../../config/checkLogin');

module.exports.controller = function (app) {

    app.get('/review/rating/:post_id', checkLogin(), function (req, res) {
        
        var post_id = req.params.post_id;
        ReviewRating.findOne({post_id:post_id,from_id:req.session.Auth._id }).exec(function(err, reviewrating){
    	Post.findOne({_id:post_id, $or:[ {'user_id':req.session.Auth._id}, {'awarded_to':req.session.Auth._id} ]}).populate('user_id').populate('awarded_to').exec(function(err, data){
    		if(err)
                throw err;
                if(!data){
                    
                    res.redirect('front/home/404');
                }
	         res.render('front/review/review_rating', {
	            page_title: 'Review & Rating',
                 req: req,
                 reviewrating:reviewrating,
	             data:data
	         });
    	});
    	});
    });


     app.post('/post/reviewrating', function (req, res) {
        var ReviewRatingObj = new ReviewRating();
        ReviewRatingObj.to_id = req.body.to_id;
        ReviewRatingObj.from_id = req.session.Auth._id;
        ReviewRatingObj.post_id = req.body.post_id;
        ReviewRatingObj.review = req.body.review;
        ReviewRatingObj.rating = req.body.rating;
        ReviewRatingObj.review_for = req.body.review_for;
        /*set notification status 5 = payment Request created*/
        ReviewRatingObj.save(function (err, data) {
            if (err)
                throw err;
                
                ReviewRating.find({ to_id: req.body.to_id }, function (err, totalreviewscount) {
                    req.ratingcount = totalreviewscount.length;
                    
                    ReviewRating.aggregate([{ "$match": { "to_id": mongoose.Types.ObjectId(req.body.to_id) }},{$group : {_id: "", toal_rating : {$sum : "$rating"}}}], function(error, totalrows) {
                        req.total_rating = (totalrows.length > 0) ? totalrows[0].toal_rating : 0;
                    User.findOne({ _id: req.body.to_id }, function (err, user) {
                    if (user) {
                        if (err)
                            throw err;
                             user.rating = req.total_rating/req.ratingcount;
                            user.save(function (err, user) {
                            if (err)
                                throw err;    
                        });

                    } 
                });
                });
            });
                     

            var Notificationobj = new Notification();
            Notificationobj.creator_id = req.session.Auth._id;
            Notificationobj.reciever_id = req.body.to_id;
            Notificationobj.status = 6;
            Notificationobj.project_id = req.body.post_id;
            Notificationobj.save(function(){
                 res.redirect("post/details/"+req.body.post_id);
            
            });

           
                   
        });

    });   
};
