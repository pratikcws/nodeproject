var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    from_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    to_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    msg_head_id: mongoose.Schema.Types.ObjectId,
    message: String,
    status: {type: Number, default: 0}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});

obj = mongoose.model('Message', tblSchema);
module.exports = obj;

