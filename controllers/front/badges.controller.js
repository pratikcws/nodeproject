
var checkLogin = require('../../config/checkLogin');


module.exports.controller = function (app) {

    app.get('/account/badge/police-verification', checkLogin(), function (req, res, next) {
        res.render('front/badges/police_verification', {page_title: "police verification", req: req});
    });
	

	app.post('/badges/policeverification', function (req, res) {
        req.check('u_first_name', "firstname is required").notEmpty();
        req.check('u_last_name', "lastname is not valid").notEmpty();
        req.check('dob', "Date Of Birth is not valid").notEmpty();
		var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            var badge = new badge();
            PostObj.title = req.body.title;
            PostObj.category = req.body.category;
            PostObj.description = req.body.description;
            PostObj.make_an_offer = req.body.make_an_offer;
            PostObj.person_type = req.body.person_type;
            PostObj.suburb = req.body.suburb;
            PostObj.due_date = req.body.due_date;
            PostObj.tasker_need = req.body.tasker_need;
            PostObj.budget_type = req.body.budget_type;
            PostObj.budget = req.body.budget;
            PostObj.user_id = req.session.Auth._id;
            PostObj.budget = req.body.budget;
            PostObj.created_at = new Date();
            PostObj.updated_at = new Date();
            var lat = req.body.lat;
            var lng = req.body.lng;
            PostObj.location = {"coordinates": [lat, lng], "type": "Point"}

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
  
};


