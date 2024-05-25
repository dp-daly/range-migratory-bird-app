const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Sighting = require('../models/sighting.js');


router.get("/:sightingId", (req, res) => {
    res.render("../views/sighting/show.ejs");
})

module.exports = router;
