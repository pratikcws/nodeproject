var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    account_id: mongoose.Schema.Types.ObjectId,
    acc_holder_name: {type: String},
    bsb: {type: String},
    acc_number: {type:Number},
	user_id: mongoose.Schema.Types.ObjectId,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Bankaccountdetails', tblSchema);
module.exports = obj;

