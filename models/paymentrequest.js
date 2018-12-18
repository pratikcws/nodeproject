var mongoose = require('mongoose');
var Schema = mongoose.Schema
tblSchema = new Schema({
    to_user_id: {type: mongoose.Schema.Types.ObjectId},
    from_user_id: {type: mongoose.Schema.Types.ObjectId},
    post_id: {type: mongoose.Schema.Types.ObjectId},
    status: {type: Number, default: 1},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
}),
obj = mongoose.model('PaymentRequest', tblSchema);

module.exports = obj;