const express = require("express");
const app = express();
const port = 3000;
const { redirectPage, authenticate, fetchUserStats } = require("./osu.js");
const { getUser, createNewUser, registerUser, addNewComment, clearComments } = require("./profileMethods.js");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");

mongoose.connect("mongodb://localhost:27017/osuProfileRatings");
const db = mongoose.connection;

app.use(
    session({
        secret: "goodmorning",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600 * 24 * 1000 }, // 1 day
        store: MongoStore.create({
            mongoUrl: "mongodb://localhost:27017/osuProfileRatings",
        }),
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.json({ success: false, error: "Not logged in" });
    }
    next();
};

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {

    redirectPage().then((url) => {
        res.redirect(url);
    });
});

app.get("/oauth/login", (req, res) => {
    if (!req.query.code) {
        res.send({ success: false, error: "No code provided" });
    } else {
        authenticate(req.query.code)
            .then((user_data) => {
                req.session.user_id = user_data.id;
                req.session.username = user_data.username;
                getUser(user_data.id).then((user) => {
                    if (user === null) {
                        createNewUser(user_data.id, user_data.username, true, {
                            rank: user_data.statistics.global_rank,
                            pp: user_data.statistics.pp,
                            lastUpdated: Date.now(),
                        }).then(() => {
                            console.log(
                                "User " + user_data.username + " created"
                            );
                        });
                    } else {
                        if (user.registered === false) {
                            registerUser(user_data.id).then(() => {
                                console.log(
                                    "User " + user_data.username + " registered"
                                );
                            });
                        }
                    }
                });

                res.redirect("http://localhost:3001/profile");
            })
            .catch((err) => {
                console.log(err);
                res.send("Error authenticating user. Please try again later.");
            });
    }
});

app.get("/api/profile", async (req, res) => {
    const { id } = req.query;
    getUser(id)
        .then((user) => {
            if (user === null) {
                fetchUserStats(id).then((user) => {
                    if (user.error === null) {
                        return res.json({
                            success: false,
                            message:
                                "Error getting user data. Please try again later. (User is likely banned)",
                        });
                    }
                    createNewUser(id, user.username, false, {
                        rank: user.statistics.global_rank,
                        pp: user.statistics.pp,
                        lastUpdated: Date.now(),
                    })
                        .then(() => {
                            console.log(
                                `Unregistered user ${user.username} (${user.id}) created`
                            );
                            return res.json({
                                success: true,
                                user: user,
                            });
                        })
                        .catch((err) => {
                            console.log("Error creating new user", err);
                            return res.json({
                                success: false,
                                message:
                                    "Error creating new user. Please try again later.",
                            });
                        });
                });
            } else {
                res.json({
                    success: true,
                    user: user,
                });
            }
        })
        .catch((e) => {
            console.log(e);
            return res.json({
                success: false,
                message: "Unable to get user info, try again later",
            });
        });
});

app.post("/api/submitComment", requireLogin, (req, res) => { 

    const {userId, comment } = req.body;
    console.log(userId, req.session.user_id, req.session.username, comment)
    

    addNewComment(userId, req.session.user_id, req.session.username, comment).then((comment) => {
        res.json({
            success: true,
            message: "Comment added",
            comment: comment,
        });
    }).catch((e) => {
        console.log("Comment not added", e)
        res.json({
            success: false,
            message: "Comment not added"
        })
    })
    

});

app.get("/api/getUserData", requireLogin, (req, res) => {
    getUser(req.session.user_id)
        .then((user) => {
            res.json({
                success: true,
                user: user,
            });
        })
        .catch((e) => {
            console.log(e);
        });
});

app.get("/api/logout", (req, res) => {
    req.session.destroy();
    res.json({
        success: true,
        message: "Logged out successfully",
    });
});

//serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Connected to MongoDB");
    
    // addNewComment(11625048, 11625048, "Kawambiit", "test").then(() => {
    //     console.log("Comment added");
    // });


    // db.collection("profiles").drop();
    // db.dropDatabase();
    // console.log("Database Reset")
    // clearComments(11625048).then(() => {
    //     console.log("Comments cleared");
    // });
});
