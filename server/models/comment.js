const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    username: String,
    comment: String,
    date: {type: Date, default: Date.now}
});

const comment = mongoose.model("comment", commentSchema)

module.exports.commentSchema = commentSchema;
module.exports.comment = comment;
