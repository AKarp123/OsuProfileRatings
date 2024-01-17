const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.ratingSchema = new Schema({
    username: String,
    userId: Number,
    rating: Number,
    date: {type: Date, default: Date.now}
});

module.exports.rating = mongoose.model('rating', module.exports.ratingSchema);

