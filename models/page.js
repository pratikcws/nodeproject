var mongoose = require('mongoose');
var Schema = mongoose.Schema
tblSchema = new Schema({
    slug:  {type: String},
    title:  {type: String},
    description: {type: String},
    status: {type: Number, default: 1},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
}),
obj = mongoose.model('Page', tblSchema);

module.exports = obj;