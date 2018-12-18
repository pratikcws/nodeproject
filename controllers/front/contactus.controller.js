var Contactus = require('../../models/contactus');
var checkAdmin = require('../../config/checkAdmin');

module.exports.controller = function (app) {
    app.get('/admin/contactus', checkAdmin(), function (req, res) {
        res.render('admin/contactus/list', {
            page_title: "Contact Us | KIJIJI Admin",
            waiter: true,
            active_tab: "contactus",
        });
    });
    app.post('/admin/contactus/ajaxlist', checkAdmin(), function (req, res, next) {
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
        // var whereCod = {
        // $or: [
        // {trans_id: {$regex: ".*" + searchval.trim() + ".*", $options: 'i'}},
        // ],
        // };

        sortjson[sortcol] = sortval;
        Contactus.find({}, function (err, result) {
           
            if (err)
                throw err;

            var json = {};
            var data = [];
            var i = 0;
            for (i = 0; i < result.length; i++) {
                var sr_num = i;
                var childarray = {};
                childarray._id = ++sr_num;
                childarray.name = result[i].name;
                childarray.email = result[i].email;
                childarray.subject = result[i].subject;
                childarray.message = result[i].message;
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
};
