var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    billing_id: mongoose.Schema.Types.ObjectId,
    address1: {type: String},
    address2: {type: String},
    city: {type: String},
    state: {type: String},
    postcode: {type: String},
    country: {type: String},
	user_id: mongoose.Schema.Types.ObjectId,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Billingaddress', tblSchema);
module.exports = obj;

