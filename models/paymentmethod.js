var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    payment_id: mongoose.Schema.Types.ObjectId,
    card_number: {type:Number},
    exp_date: {type: String},
    cvc: {type:Number},
	user_id: mongoose.Schema.Types.ObjectId,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Paymentmethod', tblSchema);
module.exports = obj;

