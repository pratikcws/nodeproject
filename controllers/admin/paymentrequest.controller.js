var Fundrequest = require('../../models/fundrequest');
var ObjectID = require('mongodb').ObjectID;
var bcryptjs = require('bcryptjs');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {
    app.get('/admin/paymentrequest',  checkAdmin(), function (req, res, next) {
		res.render('admin/paymentrequest/list',  {page_title: "Post | Admin", role: true, active_tab:"post"});
    });

    app.post('/admin/paymentrequest/ajaxlist', checkAdmin(), function (req, res, next) {
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
            //  $or: [
            //      {trans_id: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
            //  ],
        };

        sortjson[sortcol] = sortval;
        Fundrequest.find({}).exec(function (err, counts) {
        count = counts.length;
        Fundrequest.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {				
        if (err)
            throw err;
        
        var json = {};
        var data = [];
        var i = 0;
        for (i = 0; i < result.length; i++) {
            var sr_num = i;
            var childarray = {};
            childarray._id = ++sr_num;
            childarray.user_id = (!result[i].user_id) ? '---':result[i].user_id;
            childarray.acc_holder_name = (!result[i].acc_holder_name) ? '---':result[i].acc_holder_name;
            childarray.bsb = result[i].bsb;
            childarray.acc_number = result[i].acc_number;
            childarray.amount = result[i].amount;
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
};
