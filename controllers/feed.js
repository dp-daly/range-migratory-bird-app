const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Sightings = require('../models/sighting.js');


router.get("/", async (req, res) => {
    const sightings = await Sightings.find();
    console.log(sightings)
    res.render('../views/feed/feed.ejs', {
      sightings,
    })
})

router.post("/", async (req, res) => {
    req.body.publisher = req.session.user.userId;
    const sighting = await Sighting.create(req.body);
    res.render("../views/sighting/show.ejs", {
        sighting,
    })
})

module.exports = router; 