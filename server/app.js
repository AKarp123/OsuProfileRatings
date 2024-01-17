const express = require("express");
const app = express();
const port = 3000;
const { redirectPage, authenticate, fetchUserStats } = require("./osu.js");
const { getUser, createNewUser, registerUser } = require("./profileCreation.js");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/osuProfileRatings");
const db = mongoose.connection;

app.use(
    session({
        secret: "goodmorning",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600 * 24 * 1000 }, // 1 day
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
                        createNewUser(user_data.id, user_data.username).then(
                            () => {
                                console.log(
                                    "User " + user_data.username + " created"
                                );
                            }
                        );
                    }
                    else {
                        if(user.registered === false) {
                            registerUser(user_data.id).then(() => {
                                console.log("User " + user_data.username + " registered");
                            })
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

// app.get("/profile", (req, res) => {
//     if (req.session.user_id) {
//         res.send("Logged in as " + req.session.user_id + " - " + req.session.username);
//     } else {
//         res.send("Not logged in");
//     }
// });

// app.get("/api/profile", requireLogin, (req, res) => {
//     console.log("hello1");
//     getUser(req.session.user_id).then((user) => {
//         res.json({
//             success: true,
//             user: user,
//         });
//     });
// });
app.get("/api/profile", async (req, res) => {
    const { id } = req.query;
    console.log("hello");
    getUser(id).then((user) => {
        if (user === null) {
            console.log("Generating new unregistered user");
            // createNewUser(id, req.body.username, false).then(() => {
            //     console.log("User " + req.body.username + " created");
            // });'
            fetchUserStats(id).then((user) => {
                
                if(user.error === null) {
                    return res.json({success: false, message: "Error getting user data. Please try again later. (User is likely banned)"});
                }
                createNewUser(id, user.username, false).then(() => {
                    console.log("User " + user.username + " created");
                })
                .catch((err) => {
                    // console.log("Error creating new user", err);
                    
                })
            });
        } else {
            res.json({
                success: true,
                user: user,
            });
        }
    });
});

app.get("/api/getUserData", requireLogin, (req, res) => {
    getUser(req.session.user_id).then((user) => {
        res.json({
            success: true,
            user: user,
        });
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
    // db.dropDatabase();
    // console.log("Database Reset")
});
