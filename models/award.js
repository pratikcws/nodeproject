var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var awardSchema = new Schema({

    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
    created_by: {type: String},
    awarded_to: {type: String},
    status: {type: Number, default: 0}, // 1 = awarded, 2 = accept , 3 =reject
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
})
var award = mongoose.model('Award', awardSchema)

module.exports = award;
