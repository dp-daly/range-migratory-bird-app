const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Sighting = require('../models/sighting.js');
const Comment = require('../models/comment.js');


router.get("/:sightingId", async (req, res) => {
    if (req.session.user) {
        try {
            const sighting = await Sighting.findById(req.params.sightingId).populate("publisher");
            const currentUser = req.session.user._id;
            const publisher = sighting.publisher.toString();
            const comments = sighting.comments;
            res.render("../views/sighting/show.ejs", {
                sighting,
                comments,
                publisher,
                currentUser,
            });
        } catch (err) {
            res.render("error.ejs", {systemErrorMessage: err.message});
        };
    } else {
        res.redirect("/auth/sign-in");
    };
});

module.exports = router;
