var mongoose = require('mongoose');
var fs = require('fs');
var Category = require('../../models/category');
var checkAdmin = require('../../config/checkAdmin');
var Config = require('../../config/config');

module.exports.controller = function (app) {
    app.get('/admin/category', checkAdmin(), function (req, res, next) {
        Category.find({}).exec(function (err, result) {
            if (err)
                throw err;
            var json = {};
            var data = [];
            var categoriesf = '<option value=""> Please select </option>';
            for (i = 0; i < result.length; i++) {
                categoriesf += '\
                <option value="' + result[i]._id + '">' + result[i].title + '</option>\"';
            }
            res.render('admin/category/list', { page_title: "Category | Admin", active_tab: "category", categoriesf: categoriesf, parent_id: "" });
        });
    });

    app.get('/admin/category/:cat_id', checkAdmin(), function (req, res, next) {

        res.render('admin/category/list', { page_title: "Category | Admin", active_tab: "category", /*categoriesf: categoriesf*/ parent_id: req.params.cat_id });

    });

    app.post('/admin/category/ajaxlist', checkAdmin(), function (req, res, next) {
        var parent_id = req.body.parent_id;
        var count = 0;
        var sortcol = req.body.columns[req.body.order[0].column].data;
        var sortval = -1;
        var searchval = req.body.search.value;
        if (req.body.order[0].dir == "desc") {
            sortval = 1;
        }
        var sortjson = {};
        sortjson[sortcol] = sortval;

        if (!parent_id) {
            var whereCod = {
                $or: [
                    { title: { $regex: ".*" + searchval + ".*", $options: 'i' } },
                    { description: { $regex: ".*" + searchval + ".*", $options: 'i' } },

                ],
                $and: [
                    { parent_id: { $exists: false } }
                ]

            };
        }
        else {
            var whereCod = {
                $or: [
                    { title: { $regex: ".*" + searchval + ".*", $options: 'i' } },
                    { description: { $regex: ".*" + searchval + ".*", $options: 'i' } },
                    { parent_id: { $exists: false } },
                ],


            };
            whereCod.parent_id = parent_id;
        }


        Category.find(whereCod).exec(function (err, counts) {
            count = counts.length;
            Category.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {

                if (err)
                    throw err;
                var json = {};
                var data = [];
                var i = 0;
                for (i = 0; i < result.length; i++) {
                    var sr_num = i;
                    var childarray = {};
                    childarray._id = ++sr_num;
                    childarray.image = '<img style="height:70px; width:70px" src="' + app.get('site_path') + "/uploads/category/" +  result[i].image + '">';//result[i].title;
                    childarray.title = result[i].title;
                    //childarray.parent_id = result[i].parent_id;
                    childarray.description = result[i].description;
                    childarray.action = '\
                    <a class="btn btn-success btn-sm a-inside editcategory" data-id="' + result[i]._id + '">Edit</a>\
                    <a class="btn btn-danger btn-sm a-inside deletecategory" data-id="' + result[i]._id + '">Delete</a>';

                    var url = app.get('site_path') + '/admin/category/' + result[i]._id;
                    //childarray.subcategory =
                      //  '<a href="' + url + '" class="btn btn-success btn-sm a-inside" data-id="' + result[i]._id + '">Sub category</a>';
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
    app.post('/admin/category/addnew', checkAdmin(), function (req, res, next) {
        req.check('title', 'category title required').notEmpty();
        req.check('description', 'description required').notEmpty();
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
        } else {
            var filename = '';
            if (req.files.image) {
                var sampleFile = req.files.image;
                var file = req.files.image;
                var tmp_path = file.path;
                var fileName = file.name;
                var file_ext = fileName.substr((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
                var filename = Config.getRandomSalt() + '.' + file_ext;
                sampleFile.mv('public/uploads/category/' + filename);
            }

            if (req.body.category_id != "undefined" && req.body.category_id.length == 0) {
                cateObj = new Category();
                cateObj.title = req.body.title;
                cateObj.description = req.body.description;
                if (req.body.parent_id != "undefined" && req.body.parent_id.length > 0) {
                    cateObj.parent_id = req.body.parent_id;
                }
                cateObj.image = filename;
                cateObj.save();
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Record inserted successfully!";
                json['catedata'] = cateObj;
                res.send(json);
            } else {
                Category.findOne({ _id: req.body.category_id }, function (err, catedata) {
                    if (err)
                        throw err;
                    catedata.title = req.body.title;
                    catedata.description = req.body.description;
                    if (filename.length > 0) {
                        fs.unlink('public/uploads/category/' + catedata.image, function (err) {

                        });
                        catedata.image = filename;
                    }
                    catedata.description = req.body.description;
                    catedata.save();
                });
                var json = {};
                json['success'] = 1;
                json['success_mess'] = "Updated Records successfully !";
                res.send(json);
            }
        }
        res.send(json);
    });

    app.post('/admin/category/getContent', checkAdmin(), function (req, res, next) {
        Category.findOne({ _id: req.body.category_id }, function (err, category) {
            if (err)
                throw err;
            var json = {};
            if (category) {
                json['success'] = 1;
                json['success_mess'] = "Loaded..";
                json['roledata'] = category;
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
            res.send(json);
        });
    });

    app.post('/admin/category/deletecategory', checkAdmin(), function (req, res, next) {
        Category.findOne({ _id: req.body.category_id }, function (err, category) {
            if (err)
                throw err;
            var json = {};
            if (category) {
                category.remove();
                json['success'] = 1;
                json['success_mess'] = "Delete Records successfully !";
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
            res.send(json);
        });
    });

};