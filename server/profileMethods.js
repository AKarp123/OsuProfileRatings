const { profile } = require("./models/profile.js");
const { comment } = require("./models/comment.js");

module.exports.createNewUser = async (
    userId,
    username,
    registered = true,
    statistics
) => {
    // console.log("Hello")
    const newProfile = new profile({
        username: username,
        userId: userId,
        registered: registered,
        userRatings: [],
        rating: 0,
        ratings: [],
        ratingCount: 0,
        ratingSum: 0,
        comments: [],
        canComment: true,
        statistics: {
            ...statistics,
        },
    });
    try {
        await newProfile.save();
    } catch (e) {
        throw new Error("Error creating user: ", e);
    }
};

module.exports.getUser = async (userId) => {
    if (isNaN(userId) || userId === undefined) {
        throw new Error("Invalid userId");
    }
    try {
        const user = await profile
            .findOne({ userId: userId })
            .populate("comments" )
            .exec();
        user.comments.sort((a, b) => {
            return b.date - a.date;
        });
        return user;
    } catch (e) {
        console.log("error getting user");
        throw new Error("Unable to get user");
    }
};

module.exports.registerUser = async (userId) => {
    try {
        const user = await profile.findOne({ userId: userId }).exec();
        user.registered = true;
        await user.save();
        return true;
    } catch (e) {
        console.log("error registering user");
        return false;
    }
};

module.exports.addNewComment = async (
    userId,
    authorID,
    username,
    commentText
) => {
    try {
        const user = await profile.findOne({ userId: userId }).exec();
        if (user.canComment === false) {
            throw new Error("User cannot comment");
        }
        const newComment = new comment({
            username: username,
            userId: authorID,
            comment: commentText,
            date: Date.now(),
        });
        await newComment.save();
        user.comments.push(newComment);
        await user.save();
        return newComment;
    } catch (e) {
        console.log("error adding comment", e);
        throw new Error("Error adding comment");
    }
};
