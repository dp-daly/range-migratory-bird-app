const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { Sighting } = require('../models/sighting.js');

router.get("/:userId", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    console.log("THIS IS MY CONSOLE LOG: " + userInDb)
    const sightings = await Sighting.find({ publisher: currentUser }).populate()
    res.render("../views/auth/perch.ejs", {
        name: userInDb.firstname,
        sightings,
    })
})

router.get("/:userId/new-sighting", (req, res) => {
    res.render("../views/sighting/new-sighting.ejs")
})

router.get("/:userId/:sightingId/edit", (req, res) => {
    res.send(`This is where I come to edit my sighting: ${req.params.sightingId}`)
})

module.exports = router;
