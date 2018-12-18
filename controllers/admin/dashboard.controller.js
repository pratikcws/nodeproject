
var checkAdmin = require('../../config/checkAdmin');
var User  = require('../../models/user');
var Post  = require('../../models/post');
var Servicecharge  = require('../../models/servicecharge');
var Category  = require('../../models/category');
var Transaction  = require('../../models/transaction');

module.exports.controller = function (app) {
  function totalUser(req, res, next) {
   	User.find({}, function(error, rows) {
	        req.total_user = rows.length;
	        return next();
		});
	}

	function totalAmtTrans(req, res, next){
		Transaction.aggregate([{$group : {'_id':'', toal_amount : {$sum : "$amount"}}}], function(error, rows) {
	        req.total_amount = (rows.length > 0) ? rows[0].toal_amount : 0;
	        return next();
		});
	}

	
	function totalPost(req, res, next) {
	    Post.find({}, function(error, rows) {
	        req.total_post = rows.length;
	        return next();
		});
	}

	function totalCat(req, res, next) {
	    Category.find({}, function(error, rows) {
	        req.total_categories = rows.length;
	        return next();
		});
	}
	function renderpage(req, res) {
		Servicecharge.findOne({}, function (err, Service) {
	    res.render('admin/home/index', {
	        total_user: req.total_user,
	        total_post: req.total_post,
	        total_categories: req.total_categories,
	        total_amount: req.total_amount,
	        page_title: "Dashboard ", 
			req: req, 
			Service: Service,
	        active_tab: "dashboard"
		});
	});
	}

	app.get('/admin/dashboard', checkAdmin(), totalUser, totalPost, totalCat, totalAmtTrans,  renderpage);





	




	app.post('/admin/dashboard/servicecharge',  checkAdmin(), function (req, res, next) {
        req.check('posterfee', 'Posterfee required').notEmpty();
		req.check('taskerfee', 'Taskerfee required').notEmpty();
		
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            Servicecharge.findOne({_id: req.body.id}, function (err, Service) {

                if (Service) {
                    if (err)
                        throw err;
						Service.taskerfee = req.body.taskerfee;
						Service.posterfee = req.body.posterfee;
						
						Service.save(function (err, Service) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;
                        json['success_mess'] = "Updated successfully !";
                        res.send(json);
                    });
                } else {
					ServiceChargeObj = new Servicecharge();
					ServiceChargeObj.posterfee = req.body.posterfee;
					ServiceChargeObj.taskerfee = req.body.taskerfee;
					ServiceChargeObj.servicepercentage = req.body.servicepercentage;
					 ServiceChargeObj.save(function (err, Servicecharge) {
                        if (err)
                            throw err;
                        var json = {};
                        json['success'] = 1;

                        json['success_mess'] = "submit successfully !";
                        res.send(json);
                    });
                }
            });
        }
    });


};


