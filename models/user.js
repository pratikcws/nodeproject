var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    refid: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    mobile: { type: Number, default: 0 },
    mobile_verify: { type: Number, default: 0 },
    otp: { type: Number, default: 0 },
    tagline: { type: String },
    description: { type: String },
    birthday: { type: Date },
    abn: { type: Number },
    device_id: { type: String },
    twitter_id: { type: String },
    facebook_id: { type: String },
    is_social_login: { type: Boolean, default: 0 },
    gender: { type: String },
    age: { type: Number },
    reset_token: { type: String },
    location: { type: String },
    city: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    email: { type: String },
    email_verified: { type: Boolean, default: false },
    password: { type: String },
    device_type: { type: String },
    address: { type: String },
    last_login: { type: Date },
    last_login_token: { type: String },
    status: { type: Number, default: 0 },
    block: { type: Number, default: 0 },
    cover: { type: String },
    user_image: { type: String, default: null },
    earn_money: { type: String },
    post_task: { type: String },
    available_balance: { type: String, default: 0 },
    rating: { type: String, default: 0 },
    user_resume: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },

});

module.exports = mongoose.model('User', user);




