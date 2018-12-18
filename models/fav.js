var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
	post_id: { type: mongoose.Schema.Types.ObjectId , ref: 'Post'}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});

obj = mongoose.model('Favorite', tblSchema);
module.exports = obj;

