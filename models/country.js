var mongoose = require('mongoose');
var Schema = mongoose.Schema
tblSchema = new Schema({
    country_name: String,
    status: {type: Number, default: 1},
    created_at: {type: Date},
    created_by: {type: mongoose.Schema.Types.ObjectId},
    updated_at: {type: Date, default: Date.Now},
    updated_by: {type: mongoose.Schema.Types.ObjectId}
}),
obj = mongoose.model('Country', tblSchema);

module.exports = obj;