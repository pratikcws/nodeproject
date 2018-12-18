var Category = require('../../models/category');
var User = require('../../models/user');
var Contactus = require('../../models/contactus');
var request = require("request");


module.exports.controller = function (app) {

    app.get('/', function (req, res) {
        var type = req.query['type'];
        var refid = req.query['token'];
        User.find({}).limit(2).exec(function (err, userdata) {
            if (err)
                throw err;
            Category.find().exec(function (err, catdata) {
                if (err)
                    throw err;
                Category.aggregate([{
                    $lookup:
                    {
                        from: 'posts',
                        localField: "_id",
                        foreignField: "category",
                        as: 'posts'
                    }
                },
                { $limit: 5 },
                ]).exec(function (err, ccdata) {
                    if (err) {
                        throw err;
                    }
                    res.render('front/home/index', { page_title: "Home", req: req, catdata: catdata, type: type, refid: refid, userdata: userdata, ccdata: ccdata });
                });
            });

        });

    });

    app.get('/contactus', function (req, res) {
        res.render('front/home/contactus', { page_title: "contactus", req: req });
    });


    app.post('/contactus/add', function (req, res, next) {
        req.check('name', "Name is required").notEmpty();

        var errors = req.validationErrors();
        var json = {};
        if (errors) {
            json['error'] = 1;
            json['error_mess'] = errors;
            res.send(json);
        } else {

            var Contactusobj = new Contactus();
            Contactusobj.name = req.body.name;
            Contactusobj.email = req.body.message;
            Contactusobj.subject = req.body.subject;
            Contactusobj.message = req.body.message;
            Contactusobj.status = 1;

            Contactusobj.save(function (err, Contactusobj) {
                if (err)
                    throw err;
                var json = {};
                json['success'] = 1;

                json['success_mess'] = "Your Enquiry submit successfully !";
                res.send(json);
            });
        }
    });


    app.get('/invite-user/:id?', function (req, res, next) {
        var id = req.params.id;
        res.redirect('/?type=signup&token=' + id);

    });

    app.get('/testmsg', function (req, res, next) {
        var options = {
            method: 'POST',
            url: 'https://my.smscentral.com.au/api/v3.2',
            headers:
            {
                // 'postman-token': 'ea1c7761-8b65-34e2-57cf-7b64827f17ab',
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form:
            {
                USERNAME: 'benstefanescu@yahoo.com.au',
                PASSWORD: 'Letmein100*',
                ACTION: 'send',
                ORIGINATOR: 'abc',
                RECIPIENT: '917999994614',
                MESSAGE_TEXT: '12334'
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            console.log(body);
        });
    });
};
















