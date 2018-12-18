var mongoose = require('mongoose');
var Schema = mongoose.Schema
citySchema = new Schema({
    city_name: String,
    state_id: mongoose.Schema.Types.ObjectId,
    country_id: mongoose.Schema.Types.ObjectId,
    status: {type: Number, default: 1},
    created_at: {type: Date, default: Date.now},
    created_by: {type: mongoose.Schema.Types.ObjectId},
    updated_at: {type: Date, default: Date.now},
    updated_by: {type: mongoose.Schema.Types.ObjectId}
}),
City = mongoose.model('Citie', citySchema);

module.exports = City;