var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
	offer_id: mongoose.Schema.Types.ObjectId,
    offer_amount: {type: String},
    offer_description: {type: String},
	project_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
	service_amount: {type: String, default: 0},
	tasker_amount: {type: String , default: 0},
	status: {type: Number, default: 0}, // 1= award, 2 = accept, 3= reject
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	
});
offer = mongoose.model('Offer', userSchema);

module.exports = offer; 

