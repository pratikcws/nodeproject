var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    parent_id: mongoose.Schema.Types.ObjectId,
    title: {type: String},
    description: {type: String},
    image: {type: String},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});
obj  = mongoose.model('Category', tblSchema);

module.exports = obj;

