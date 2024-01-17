const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


router.get("/", (req, res) => {
    if (req.session.user_id) {
        res.send("Logged in as " + req.session.user_id + " - " + req.session.username);
    } else {
        res.send("Not logged in");
    }
}
);

module.exports.profileRouter = router;

