const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { Sighting } = require('../models/sighting.js');


router.get("/", async (req, res) => {
    const sightings = await Sighting.find();
    console.log(sightings)
    res.render('../views/feed/feed.ejs', {
      sightings,
    })
})

router.post("/", async (req, res) => {
    req.body.publisher = req.session.user.userId;
    const sighting = await Sighting.create(req.body);
    res.redirect(`/sighting/${sighting._id}`)
});

module.exports = router; 