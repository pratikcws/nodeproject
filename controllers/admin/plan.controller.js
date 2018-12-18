var mongoose = require('mongoose');
var Plan = require('../../models/plan');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {
   //  app.get('/admin/plan',  checkAdmin(), function (req, res, next) {
   //      res.render('admin/plan/list',  {page_title: "Plan | Admin", role: true, active_tab:"plan"});
   //  });

   //  app.post('/admin/plan/ajaxlist', checkAdmin(),  function (req, res, next) {
   //      var count = 0;
   //          var sortcol = req.body.columns[req.body.order[0].column].data;
   //          var sortval = -1;
   //          var searchval = req.body.search.value;
   //          // if (req.body.order[0]['dir'] == "desc") {
   //          if (req.body.order[0].dir == "desc") {
   //              sortval = 1;
   //          }
   //          var sortjson = {};
			// sortjson[sortcol] = sortval;
        
   //      var whereCod = {
   //             $or: [
   //                 {title: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
   //                 {slug: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
   //                 {description: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
   //             ],

   //          };
        
        
   //      Plan.find(whereCod).exec(function (err, counts) {
   //          count = counts.length;
   //          Plan.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {
   //              if (err)
   //                  throw err;
                
   //              var json = {};
   //              var data = [];
   //             var i = 0;
   //                  for (i=0; i < result.length; i++) {
   //                  var sr_num = i;
   //                  var childarray = {};
   //                  childarray._id = ++sr_num;
   //                  childarray.title = result[i].title;
   //                  childarray.slug = result[i].slug;
   //                  childarray.price = result[i].price;
   //                  childarray.days = result[i].days;
   //                  childarray.description = result[i].description;
   //                  childarray.action = '\
   //                  <a class="btn btn-success btn-sm a-inside editPage" data-id="' + result[i]._id + '">Edit</a>\
   //                  <a class="btn btn-danger btn-sm a-inside deletePage" data-id="' + result[i]._id + '">Delete</a>';
   //                  data.push(childarray);
   //              }
   //              json['success'] = 1;
   //              json['success_mess'] = "your logging successfully";
   //              json['data'] = data;
   //              json['recordsTotal'] = count;
   //              json['recordsFiltered'] = count;
   //              res.send(json);
   //          });
   //      });
   //  });
   //  app.post('/admin/plan/addnew',  checkAdmin(), function (req, res, next) {
		
   //      req.check('title', 'title required').notEmpty();
   //      req.check('slug', 'Slug required').notEmpty();
   //      req.check('price', 'price required').notEmpty();
        
        
   //      req.check('description', 'Description required').notEmpty();
   //      var errors = req.validationErrors();
   //      var json = {};
   //      if (errors) {
   //          json['error'] = 1;
   //          json['error_mess'] = errors;
   //      } else {
   //          if (req.body.plan_id.length == 0) {
   //              PlanObj = new Plan();
   //              PlanObj.title = req.body.title;
   //              PlanObj.slug = req.body.slug;
   //              PlanObj.price = req.body.price;
   //              PlanObj.days = req.body.days;
   //              PlanObj.description = req.body.description;
   //              PlanObj.save()
   //              var json = {};
   //              json['success'] = 1;
   //              json['success_mess'] = "Record inserted successfully!";
   //              json['pagedata'] = PlanObj;
   //              res.send(json);
   //          } else {
   //              Plan.findOne({_id: req.body.plan_id}, function (err, pagedata) {
   //                  if (err)
   //                      throw err;

   //                  pagedata.title = req.body.title;
   //                  pagedata.price = req.body.price;
   //                  pagedata.days = req.body.days;
   //                  pagedata.slug = req.body.slug;
   //                  pagedata.description = req.body.description;
   //                  pagedata.save();
   //              });
   //              var json = {};
   //              json['success'] = 1;
   //              json['success_mess'] = "Updated Records successfully !";
   //              res.send(json);
   //          }
   //      }
   //      res.send(json);
   //  });

   //  app.post('/admin/plan/getContent',  checkAdmin(), function (req, res, next) {
   //      Plan.findOne({_id: req.body.plan_id}, function (err, pagedata) {
   //          if (err)
   //              throw err;
   //          var json = {};
   //          if (pagedata) {
   //              json['success'] = 1;
   //              json['success_mess'] = "Loaded..";
   //              json['pagedata'] = pagedata;
   //          } else {
   //              json['error'] = 1;
   //              json['error_mess'] = "Some thing error Please try again";
   //          }
   //          res.send(json);
   //      });
   //  });
   //  app.post('/admin/plan/delete', checkAdmin(),  function (req, res, next) {
   //      Plan.findOne({_id: req.body.plan_id}, function (err, pagedata) {
   //          if (err)
   //              throw err;
   //          var json = {};
   //          if (pagedata) {
   //              pagedata.remove();
   //              json['success'] = 1;
   //              json['success_mess'] = "Delete Records successfully !";
   //          } else {
   //              json['error'] = 1;
   //              json['error_mess'] = "Some thing error Please try again";
   //          }
   //          res.send(json);
   //      });
   //  });

};
