const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Sighting = require('../models/sighting.js');
const Comment = require('../models/comment.js');


router.get("/:sightingId", async (req, res) => {
    const sighting = await Sighting.findById(req.params.sightingId);
    const comments = sighting.comments;
    res.render("../views/sighting/show.ejs", {
        sighting,
        comments,
    });
});

module.exports = router;
