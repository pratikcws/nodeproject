var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    project_id: mongoose.Schema.Types.ObjectId,
    comment: String,
    status: {type: Number, default: 1}, 
    comment_image: {type: String,default: null}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});

obj = mongoose.model('Comment', tblSchema);
module.exports = obj;

