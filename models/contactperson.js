var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    mobile_no: String,
    message: String,
    status: {type: Number, default: 1}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});

obj = mongoose.model('Contactperson', tblSchema);
module.exports = obj;

