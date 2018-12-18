var mongoose = require('mongoose');
var tblSchema = mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    image: {type: String},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    
});
obj  = mongoose.model('Portfolio', tblSchema);

module.exports = obj;

