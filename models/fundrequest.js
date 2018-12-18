var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    acc_number: {type:String},
    bsb: {type: String},
    acc_holder_name: {type: String},
    address1: {type: String},
    address2: {type: String},
    country: {type: String},
    state: {type: String},
    city: {type: String},
    postcode: {type:Number, default:0},
    amount: {type:Number, default:0},
    user_id: mongoose.Schema.Types.ObjectId,
    status: {type:Number, default:0}, //1 REQUEST SEND BY USER , 2 = processing, 3= complete 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}, 
});

obj = mongoose.model('Fundrequest', tblSchema);
module.exports = obj;


