var mongoose = require('mongoose');
var Schema = mongoose.Schema
tblSchema = new Schema({
    state_name: String,
    country_id: mongoose.Schema.Types.ObjectId,
    status: {type: Number, default: 1},
    created_at: {type: Date},
    created_by: {type: mongoose.Schema.Types.ObjectId},
    updated_at: {type: Date, default: Date.Now},
    updated_by: {type: mongoose.Schema.Types.ObjectId}
}),
obj = mongoose.model('State', tblSchema);

module.exports = obj;