var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    post_id: mongoose.Schema.Types.ObjectId,
    subject: {type: String},
    message: {type: String},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});
obj  = mongoose.model('Postreports', tblSchema);

module.exports = obj;
