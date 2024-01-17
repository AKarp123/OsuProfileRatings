const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { commentSchema } = require("./comment.js");
const { ratingSchema } = require("./rating.js");

const profileSchema = new Schema({
    username: { type: String, required: true, unique: true },
    userId: { type: Number, required: true, unique: true},
    registered: Boolean,
    userRatings: [{ id: Number, rating: Number }], //ratings user has given to other users
    rating: Number,
    ratings: [
        {
            type: Schema.Types.ObjectId,
            ref: "rating",
        },
    ], //ratings user has received from other users
    ratingCount: Number,
    ratingSum: Number,
    ratingAverage: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    canComment: Boolean,
});

module.exports.profile = mongoose.model("profile", profileSchema);
