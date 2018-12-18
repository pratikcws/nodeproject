var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    post_id: mongoose.Schema.Types.ObjectId,
    payment_to: mongoose.Schema.Types.ObjectId,
    trans_id: String,
    amount: {type:Number},
    payment_mode: String,
    payment_status: {type: Number, default: 1},
    payment_type: String,
    payment_date: {type: Date, default: Date.now},
	info:String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Transaction', tblSchema);
module.exports = obj;

