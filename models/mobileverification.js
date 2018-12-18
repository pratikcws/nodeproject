var mongoose = require('mongoose');
var mobileSchema = mongoose.Schema({
	mobile: {type: String},
    otp: {type: String},
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	status: {type: String},
	created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});
mobile = mongoose.model('MobileVerification', mobileSchema);

module.exports = mobile; 

