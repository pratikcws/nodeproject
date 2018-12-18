var Transaction = require('../../models/transaction');
var ObjectID = require('mongodb').ObjectID;
var bcryptjs = require('bcryptjs');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {
    app.get('/admin/transaction', checkAdmin(), function (req, res) {
        res.render('admin/transaction/list', {
            page_title: "transaction | KIJIJI Admin", 
            waiter: true, 
            active_tab: "transaction",
        });
    });
    app.post('/admin/transaction/ajaxlist', checkAdmin(), function (req, res, next) {
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
                     {trans_id: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
                 ],
            };

            sortjson[sortcol] = sortval;
            Transaction.find(whereCod).exec(function (err, counts) {
            count = counts.length;
            Transaction.find(whereCod).sort(sortjson).skip(parseFloat(req.body.start)).limit(parseFloat(req.body.length)).exec(function (err, result) {				
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
                childarray.post_id = (!result[i].post_id) ? '---':result[i].post_id;
                childarray.trans_id = result[i].trans_id;
                childarray.amount = result[i].amount;
                childarray.payment_mode = result[i].payment_mode ?  result[i].payment_mode : '---';
                childarray.payment_status = (result[i].payment_status) ? '<label class="label label-success">Success</label>' : '<label class="label label-danger"> Failed </label>';
                childarray.payment_type = result[i].payment_type ? result[i].payment_type : '---';
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

   app.post('/admin/transaction/getContent', checkAdmin(), function (req, res, next) {
         Transaction.findOne({_id: req.body.transaction_id}, function (error, userdata) {
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

};
