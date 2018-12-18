var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var session = require('express-session');
var fs = require('fs');
var fileUpload = require('express-fileupload');
var app = express();
var mongoDB = require('./config/database');
var config = require('./config/config');

var User = require('./models/user');
var port = process.env.PORT || 3300;

app.use(session({
    secret: 'rahulnagar123',
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

app.set('site_path', 'https://guarded-journey-38917.herokuapp.com'); 

//app.set('site_path', 'http://127.0.0.1:' + port);


app.locals({
    site_url: function (toWho = '') {
        return app.get('site_path') + '/' + toWho;
    },
    convertdate: function (str) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);

        return [day, mnth, date.getFullYear()].join("-");
    },
    timeago: function (date) {
        var today = date;
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var h = today.getHours();
        var i = today.getMinutes();
        var s = today.getSeconds();
        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + i + ':' + s;
        return today;
        //console.log(today);
    },



    expertiepercent: function () {
        return 5;
    }
});

function doesFileExist(urlToFile)
{
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}

app.use(express.static(__dirname + '/public'));

var mongoose = require('mongoose');
mongoose.connect(mongoDB.url);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// all environments
app.set('port', port);

// app.use(express.logger('dev'));
// var logger = require('morgan');
// app.use(logger); 
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(validator());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));
app.use(fileUpload());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

fs.readdirSync('./controllers/front').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controllers/front/' + file);
        route.controller(app);
    }
});

fs.readdirSync('./controllers/admin').forEach(function (file) {
    if (file.substr(-3) == '.js') {
        route = require('./controllers/admin/' + file);
        route.controller(app);
    }
});

app.use(app.router);

//handle 404 error when user put unknow routes


app.get('*', function (req, res) {
    res.render('front/home/404', { page_title: "404 page not found ", req: req });
});

//-------------

app.listen(port, function () {
    console.log('Our app is running on http://localhost:' + port);
});
