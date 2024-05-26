const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { Sighting } = require('../models/sighting.js');


router.get("/:sightingId", async (req, res) => {
    const sighting = await Sighting.findById(req.params.sightingId)
    res.render("../views/sighting/show.ejs", {
        sighting,
    });
})

module.exports = router;
