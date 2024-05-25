const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get("/", (req, res) => {
    res.send("This is the feed.")
})

router.post("/", async (req, res) => {
    //Push req.body to db sightings array
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.sightings.push(req.body);
    await userInDb.save();
    //Pass only that sightings' details back to the client for rendering
    const latestSighting = userInDb.sightings[userInDb.sightings.length -1];
    const { location, time, timezone, species, subspecies, rare, image, description, comments } = latestSighting;
    res.render("../views/feed/feed.ejs", {
        location,
        time,
        timezone,
        species,
        subspecies,
        rare,
        image,
        description,
        comments,
    })
})

module.exports = router; 