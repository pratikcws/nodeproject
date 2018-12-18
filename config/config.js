var twitterAuth = { 
	consumerKey: "RJaLUNA30rojeJBdBWgGsQmCB", 
	consumerSecret: "YclIoiGMrwgNpCcZOH5qaQW0vACFjFkVavx1ZGZd9tMs1bLUj4", 
	callbackURL: "http://127.0.0.1:8080/auth/twitter/callback" 
};

var getRandomSalt = function() {
    var milliseconds = new Date().getTime();
    var timestamp = milliseconds.toString();
    var random = ("" + Math.random(1000, 99999));
    return timestamp + "_" + random.substring(2, 99999);
}

var getUniqueNumber = function() {
    var milliseconds = new Date().getTime();
    var timestamp = milliseconds.toString();
    var random = ("" + Math.random(1000, 99999));
    return timestamp + random.substring(2, 99999);
}


var getCategoryUrl = function(filename) {
    return  'http://127.0.0.1:3300/uploads/category/'+filename;
}

 
module.exports.twitterAuth = twitterAuth;  
module.exports.getRandomSalt = getRandomSalt;  
module.exports.getCategoryUrl = getCategoryUrl;  
module.exports.getUniqueNumber = getUniqueNumber;  