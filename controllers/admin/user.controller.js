var User = require('../../models/user');
var ObjectID = require('mongodb').ObjectID;
var bcryptjs = require('bcryptjs');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {

    app.get('/admin/users/exports', function(req, res) {
      var data = [
          ['ID', 'Name', 'Age', 'Gender']
        , [1, 'Taro Yamada', 25, 'Male']
        , [2, 'Hanako Yamada', 24, 'Female']
        , [3, 'John Doe', 30, 'Male']
        , [4, 'Jane Doe', 30, 'Female']
      ];
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/csv');

      data.forEach(function(item) {
        res.write(item.map(function(field) {
          return '"' + field.toString().replace(/\"/g, '""') + '".csv';
        }).toString() + '\r\n');
      });
      
      res.end();
    });


    app.get('/admin/users', checkAdmin(), function (req, res) {
        res.render('admin/user/list', {
            page_title: "Users | Admin",
            waiter: true,
            active_tab: "users",
        });
    });
    app.post('/admin/user/ajaxlist', checkAdmin(), function (req, res, next) {
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
                {first_name: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
                {last_name: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
               // {mobile_no: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
                {email: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
            ],
        };

        sortjson[sortcol] = sortval;
        User.find(whereCod).exec(function (err, counts) {
            count = counts.length;
            User.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {
                if (err)
                    throw err;

                var json = {};
                var data = [];
                var i = 0;
                for (i = 0; i < result.length; i++) {
                    var sr_num = i;
                    var childarray = {};
                    childarray._id = ++sr_num;
                    childarray.full_name = result[i].first_name + " " + result[i].last_name;
                    // childarray.last_name = result[i].last_name;
                    childarray.email = result[i].email;
                    childarray.mobile_no = result[i].mobile;
                    childarray.action = '\
                    <a class="btn btn-success btn-sm a-inside edituser" data-id="' + result[i]._id + '">Edit</a>';
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

    app.post('/admin/user/addnew', checkAdmin(), function (req, res, next) {
        req.check('first_name', "User's First Name is required").notEmpty();
        req.check('last_name', "User's Last Name is required").notEmpty();
        req.check('email', 'Email is required').isEmail();
        req.check('mobile_number', 'Mobile Number is required').len(8, 15).isInt();
        if (req.body.user_id.length == 0) {
            req.check('password', 'Password is required').notEmpty().equals(req.body.conf_password);
            req.check('conf_password', 'Confirm Password is required').notEmpty();
        } else {
            if (req.body.password.length > 0) {
                req.check('password', 'Password is required').notEmpty().equals(req.body.conf_password);
                req.check('conf_password', 'Confirm Password is required').notEmpty();
            }
        }
        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {
            if (req.body.user_id.length == 0) {
                User.findOne({email: req.body.email}, function (err, sresult) {
                    if (sresult) {
                        var json = {};
                        json['error'] = 2;
                        json['error_mess'] = "Email is already exists";
                        res.send(json);
                    } else {
                        var hashedPassword = bcryptjs.hashSync(req.body.password, 10);
                        var userObj = new User({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            mobile_no: req.body.mobile_number,
                            email: req.body.email,
                            password: hashedPassword,
                            created_at: new Date(),
                            updated_at: new Date()
                        });
                        userObj.save(function (err, userdata) {
                            if (err) {
                                res.send(err);
                            }
                            var json = {};
                            json['success'] = 1;
                            json['success_mess'] = "Record inserted successfully!";
                            json['userdata'] = userdata;
                            res.send(json);
                        });
                    }
                });
            } else {
                User.findOne({_id: req.body.user_id}, function (err, sresult) {
                    if (err) {
                        throw err;
                    }
                    if (sresult) {
                        var hashedPassword = bcryptjs.hashSync(req.body.password, 10);
                        var userObj = sresult;
                        if (req.body.email != userObj.email) {
                            User.findOne({email: req.body.email, _id: {$ne: userObj._id}}, function (error, userdata) {
                                if (error) {
                                    throw error;
                                }
                                var json = {};
                                if (userdata) {
                                    var json = {};
                                    json['err'] = 2;
                                    json['error_mess'] = "Email Id already exists !";
                                    json['userdata'] = userdata;
                                    res.send(json);
                                } else {
                                    userObj.first_name = req.body.first_name;
                                    userObj.last_name = req.body.last_name;
                                    userObj.mobile_no = req.body.mobile_number;
                                    userObj.email = req.body.email;
                                    if (req.body.password.length > 0) {
                                        userObj.password = hashedPassword;
                                    }
                                    userObj.created_at = new Date();
                                    userObj.updated_at = new Date();
                                    userObj.save();
                                    var json = {};
                                    json['success'] = 1;
                                    json['success_mess'] = "Record inserted successfully!";
                                    json['userdata'] = userObj;
                                    res.send(json);
                                }
                            });
                        } else {
                            userObj.first_name = req.body.first_name;
                            userObj.last_name = req.body.last_name;
                            userObj.mobile_no = req.body.mobile_number;
                            userObj.email = req.body.email;
                            if (req.body.password.length > 0) {
                                userObj.password = hashedPassword;
                            }
                            userObj.updated_at = new Date();
                            userObj.save();
                            var json = {};
                            json['success'] = 1;
                            json['success_mess'] = "Record inserted successfully!";
                            json['userdata'] = userObj;
                            res.send(json);
                        }
                    }

                });
            }
        }
    });

    app.post('/admin/user/getContent', checkAdmin(), function (req, res, next) {
        User.findOne({_id: req.body.user_id}, function (error, userdata) {
            if (error)
                throw error;


            var json = {};
            if (userdata) {
                json['success'] = 1;
                json['success_mess'] = "Loaded..";
                json['userdata'] = userdata;
            } else {
                json['error'] = 1;
                json['error_mess'] = "Some thing error Please try again";
            }
            res.send(json);
        });
    });

    app.post('/admin/user/deleteuser', checkAdmin(), function (req, res, next) {
        User.findOne({_id: req.body.user_id}, function (err, userdata) {
            if (err)
                throw err;
            var json = {};
            if (userdata) {
                userdata.remove();
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
