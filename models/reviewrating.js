var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ReviewRatingSchema = new Schema({

    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'},
	from_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	to_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    review: {type: String},
    rating: {type: Number},
    comment : {type: String},
    review_for : {type: Number, default: 0}, // 1 for poster & 2 for tasker
    created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
})
var reviewrating = mongoose.model('ReviewRating', ReviewRatingSchema)

module.exports = reviewrating;
