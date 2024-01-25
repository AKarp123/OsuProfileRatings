const { profile } = require("./models/profile.js");

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
    if(isNaN(userId) || userId === undefined) {
        throw new Error("Invalid userId");
    }
    try {
        const user = await profile.findOne({ userId: userId }).populate().exec();
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
