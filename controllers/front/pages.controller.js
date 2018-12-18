var mongoose = require('mongoose');

module.exports.controller = function (app) {


    Array.prototype.inArray = function (value) {
        var i;
        for (i = 0; i < this.length; i++) {
            if (this[i] == value) {
                return true;
            }
        }
        return false;
    };

    app.get('/page/:page_slug', function (req, res) {
        var pageList = [
            'blog', 'blog-single'
        ];

        var page_slug = req.params.page_slug;
        if (pageList.inArray(page_slug)) {
            res.render('front/pages/' + page_slug, {page_title: "Our Story", req: req});
        } else {
            res.send('404');
        }
    });


    app.get('/pages/404', function (req, res) {

        res.render('front/home/404', {page_title: "404 ", req: req});

    });

    app.get('/pages/careers', function (req, res) {

        res.render('front/pages/careers', {page_title: "careers ", req: req});

    });
    app.get('/pages/faq', function (req, res) {

        res.render('front/pages/faq', {page_title: "faq ", req: req});

    });
    app.get('/pages/howitworks', function (req, res) {

        res.render('front/pages/howitworks', {page_title: "howitworks ", req: req});

    });
    app.get('/pages/privacypolicy', function (req, res) {

        res.render('front/pages/privacypolicy', {page_title: "privacypolicy ", req: req});

    });
    app.get('/pages/termsandcondition', function (req, res) {

        res.render('front/pages/termsandcondition', {page_title: "termsandcondition ", req: req});

    });
    app.get('/pages/aboutus', function (req, res) {

        res.render('front/pages/aboutus', {page_title: "aboutusss ", req: req});

    });
    app.get('/pages/becomeatasker', function (req, res) {

        res.render('front/pages/becomeatasker', {page_title: "becomeatasker ", req: req});

    });
};
