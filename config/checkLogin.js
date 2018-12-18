var checkLogin = function (roles = []) {
 
    return function (req, res, next) {
        if (req.session.Auth) {
             next();
        }  else {
            res.redirect("/login");
             // next();
            return;
        }
    }
};
module.exports = checkLogin;