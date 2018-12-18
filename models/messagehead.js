var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
	project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    from_userid:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    to_userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {type: Number, default: 0}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});

obj = mongoose.model('Messagehead', tblSchema);
module.exports = obj;

