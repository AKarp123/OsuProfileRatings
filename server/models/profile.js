const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const profileSchema = new Schema({
    username: { type: String, required: true, unique: true },
    userId: { type: Number, required: true, unique: true},
    registered: Boolean,
    userRatings: [{
        type: Schema.Types.ObjectId,
        ref: "rating",
    }], //ratings user has given to other users
    rating: Number,
    ratings: [
        {
            type: Schema.Types.ObjectId,
            ref: "rating",
        },
    ], //ratings user has received from other users
    ratingCount: Number,
    ratingSum: Number,
    comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    canComment: Boolean,
    statistics: {
        rank: Number,
        pp: Number,
        lastUpdated: {type: Date, default: Date.now}
    }
});


module.exports.profile = mongoose.model("profile", profileSchema);

