var checkAdmin = function (roles = []) {
    return function (req, res, next) {
        if (req.session.Admin) {
             next();
        }  else {
             res.redirect("/admin/login");
             return;
        }
    }
};
module.exports = checkAdmin;