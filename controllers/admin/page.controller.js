var mongoose = require('mongoose');
var Page = require('../../models/page');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {
   //  app.get('/admin/pages',  checkAdmin(), function (req, res, next) {
   //      res.render('admin/page/list',  {page_title: "Page | Admin", role: true, active_tab:"pages"});
   //  });

   //  app.post('/admin/pages/ajaxlist', checkAdmin(),  function (req, res, next) {
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
        
        
   //      Page.find(whereCod).exec(function (err, counts) {
   //          count = counts.length;
   //          Page.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {
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
   //                  childarray.description = '<a class="btn btn-success btn-sm a-inside page-desc-btn" data-desc="result[i].description ">Edit</a>'; 
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
   //  app.post('/admin/pages/addnew',  checkAdmin(), function (req, res, next) {
   //      req.check('title', 'Title required').notEmpty();
   //      req.check('slug', 'Slug required').notEmpty();
   //      req.check('description', 'Description required').notEmpty();
   //      var errors = req.validationErrors();
   //      var json = {};
   //      if (errors) {
   //          json['error'] = 1;
   //          json['error_mess'] = errors;
   //      } else {
   //          if (req.body.page_id.length == 0) {
   //              PageObj = new Page();
   //              PageObj.title = req.body.title;
   //              PageObj.slug = req.body.slug;
   //              PageObj.description = req.body.description;
   //              PageObj.save()
   //              var json = {};
   //              json['success'] = 1;
   //              json['success_mess'] = "Record inserted successfully!";
   //              json['pagedata'] = PageObj;
   //              res.send(json);
   //          } else {
   //              Page.findOne({_id: req.body.page_id}, function (err, pagedata) {
   //                  if (err)
   //                      throw err;

   //                  pagedata.title = req.body.title;
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

   //  app.post('/admin/pages/getContent',  checkAdmin(), function (req, res, next) {
   //      Page.findOne({_id: req.body.page_id}, function (err, pagedata) {
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
   //  app.post('/admin/pages/delete', checkAdmin(),  function (req, res, next) {
   //      Page.findOne({_id: req.body.page_id}, function (err, pagedata) {
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
