var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: {type: String},
    status: {type: Number, default: 1}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Contactus', tblSchema);
module.exports = obj;

