const {v2, auth} = require('osu-api-extended')
require('dotenv').config()

const client = {
    id: process.env.client_id,
    secret: process.env.client_secret,
    url:  "http://localhost:3000/oauth/login"
}



const SCOPE_LIST = ['public', 'identify'];
module.exports.redirectPage = async () => {
    
    
    const url = auth.build_url(client.id, client.url, SCOPE_LIST, "3c38dj384cj3828dj3",);
    return url;
};

module.exports.authenticate = async (code) => {
    const user_data = await auth.authorize(code, 'osu', client.id, client.secret, client.url);
    return user_data;
}  

module.exports.fetchUserStats = async(id) => {
    // console.log(id)
    await auth.login(client.id, client.secret, ["public"])

    try {
        const user = await v2.user.details(id, "osu", "id")
        return user;

    }
    catch(e) {
        console.log("Error fetching user stats", e);
        return null;
    }
    // console.log(user)
}




