var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    user_name: {type: String},
    mobile_no: {type: Number}, 
    email: String,
    password: String,
    last_login: Date,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});
obj = mongoose.model('Adminuser', tblSchema);

module.exports = obj;

