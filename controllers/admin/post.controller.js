var mongoose = require('mongoose');
var Post = require('../../models/post');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {
    app.get('/admin/post',  checkAdmin(), function (req, res, next) {
		res.render('admin/post/list',  {page_title: "Post | Admin", role: true, active_tab:"post"});
    });

    app.post('/admin/post/ajaxlist', checkAdmin(),  function (req, res, next) {
		  var count = 0;
            var sortcol = req.body.columns[req.body.order[0].column].data;
	
            var sortval = -1;
            var searchval = req.body.search.value;
            // if (req.body.order[0]['dir'] == "desc") {
            if (req.body.order[0].dir == "desc") {
                sortval = 1;
            }
           var sortjson = {};
            sortjson[sortcol] = sortval;
            var whereCod = {
               $or: [
                    {title: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
                    {description: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
               ]
            };
      
        
        Post.find(whereCod).exec(function (err, counts) {
            count = counts.length;
            Post.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {
                if (err)
                    throw err;
                
                var json = {};
                var data = [];
               var i = 0;
                    for (i=0; i < result.length; i++) {
                    var sr_num = i;
                    var childarray = {};
                    childarray._id = ++sr_num;
                    childarray.title = '<a target="_blank" href="'+app.get('site_path')+'/post/details/'+result[i]._id+'">'+result[i].title+'</a>';
					
                    childarray.description = '<a class="post_desc" data-desc="' +result[i].description+ '">Post Description</a>';
                    /*
                    childarray.action = '\
                    <a class="btn btn-success btn-sm a-inside editpost" data-id="' + result[i]._id + '">Edit</a>\
                    <a class="btn btn-danger btn-sm a-inside deletepost" data-id="' + result[i]._id + '">Delete</a>';*/
                    childarray.action = "--";
                    data.push(childarray);
                }
                json['success'] = 1;
                json['success_mess'] = "your logging successfully";
                json['data'] = data;
                json['recordsTotal'] = count;
                json['recordsFiltered'] = count;
                res.send(json);
            });
        });
    });


    
    app.post('/admin/post/addnew',  checkAdmin(), function (req, res, next) {
        req.check('title', 'Title required').notEmpty();
        req.check('description', 'Description required').notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
        } else {
            if (req.body.post_id.length == 0) {
                postObj = new Post();
                postObj.title = req.body.title;
                postObj.description = req.body.description;
                postObj.save()
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Record inserted successfully!";
                json['postdata'] = postObj;
                res.send(json);
            } else {
                Post.findOne({_id: req.body.post_id}, function (err, postdata) {
                    if (err)
                        throw err;
                    postdata.title = req.body.title;
                    postdata.description = req.body.description;
                    postdata.save();
                });
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Updated Records successfully !";
                res.send(json);
            }
        }
        res.send(json);
    });

    app.post('/admin/post/getContent',  checkAdmin(), function (req, res, next) {
        Post.findOne({_id: req.body.post_id}, function (err, post) {
            if (err)
                throw err;
            var json = {};
            if (post) {
                json['success'] = 1;
                json['success_mess'] = "Loaded..";
                json['roledata'] = post;
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
            res.send(json);
        });
    });
    app.post('/admin/post/deletepost', checkAdmin(),  function (req, res, next) {
        Post.findOne({_id: req.body.post_id}, function (err, post) {
            if (err)
                throw err;
            var json = {};
            if (post) {
                post.remove();
                json['success'] = 1;
                json['success_mess'] = "Delete Records successfully !";
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
            res.send(json);
        });
    });
	
	 app.get('/admin/post/getdetails/:id',  checkAdmin(), function (req, res, next) {
      
	    Post.findOne({_id: req.params.id}, function (err, data) {
            res.render('admin/post/details',  {page_title: "Post | Admin", role: true, active_tab:"post", data:data});

        });
	   
	   
	   
	   
    });

};
