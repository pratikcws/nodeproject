var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    creator_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reciever_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    status: {type: Number, default: 0}, //0-offer,1-award,2-accepted,3-reject,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
	
    
});

obj = mongoose.model('Notification', tblSchema);
module.exports = obj;