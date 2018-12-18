var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicecharge = new Schema({
    posterfee: { type: Number, default: 0 },
    taskerfee: { type: Number, default: 0 },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},

})

module.exports = mongoose.model('Servicecharge', servicecharge);




