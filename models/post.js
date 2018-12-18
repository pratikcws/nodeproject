var mongoose = require('mongoose');
var postSchema = mongoose.Schema({
    title: {type: String},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
	description: {type: String},
	make_an_offer: {type: String},
	person_type: {type: Number},
	suburb: {type: String},
	due_date:{type: Date},
	tasker_need:{type: Number},
	budget_type:{type: String},
	budget:{type: Number},
	priceguide: {type: Number},
	awarded_to: {type: mongoose.Schema.Types.ObjectId, default: null, ref: 'User'},
	
	 location: {
    type: [Number],
    index: '2d', 
},
status:{type: Number,default:1}, //1 = open , 2= award , 3= complete
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

post = mongoose.model('Post', postSchema);

module.exports = post; 
