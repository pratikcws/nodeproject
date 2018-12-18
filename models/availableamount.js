var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    post_id: mongoose.Schema.Types.ObjectId,
    amount: {type:Number},
    payment_type: {type:Number, default: 0}, //2 = debit , 1 = credit
    comment:{type:Number, default: 0}, //1 for payment release
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Availableamount', tblSchema);
module.exports = obj;

