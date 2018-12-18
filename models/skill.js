var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var userSchema = mongoose.Schema({
    // good_at: {type: String, default: null},
    // get_around: [Number],
    // qualification: {type: String},
    // languages: {type: String},
    // experience: {type: String},
    // user_id: mongoose.Schema.Types.ObjectId,
	// created_at: {type: Date, default: Date.Now},
    // updated_at: {type: Date, default: Date.Now},
    
// });
// skill = mongoose.model('skill', userSchema);

// module.exports = skill; 


var skillSchema = new Schema({

    good_at: {type: String, default: null},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	get_around: {type: String, default: null},
    qualification: {type: String},
    languages: {type: String},
    experience: {type: String},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
})
var skill = mongoose.model('Skill', skillSchema)

module.exports = skill;
