const { profile } = require("./models/profile.js");

module.exports.createNewUser = async (userId, username, registered = true) => {
    // console.log("Hello")
    const newProfile = new profile({
        username: username,
        userId: userId,
        registered: registered,
        userRatings: [],
        rating: 0,
        ratings: [],
        ratingCunt: 0,
        ratingSum: 0,
        ratingAverage: 0,
        comments: [],
        canComment: true,
    });
    try {
        await newProfile.save();

    }
    catch(e) {
        console.log(e)
    }
};

module.exports.getUser = async(userId) => {
    try{ 

        const user = await profile.findOne({ userId: userId }).exec();
        return user;
    }
    catch(e) {
        console.log("error getting user");
        return null;
    }
};

module.exports.registerUser = async(userId) => {

    try {
        const user = await profile.findOne({userId: userId}).exec();
        user.registered = true;
        await user.save();
        return true;    

    }
    catch(e) {
        console.log("error registering user");
        return false;
    }
}
