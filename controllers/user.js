const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get("/:userId", (req, res) => {
    res.send("This is my perch.")
})

router.get("/:userId/new-sighting", (req, res) => {
    res.render("../views/sighting/new-sighting.ejs")
})

router.get("/:userId/:sightingId/edit", (req, res) => {
    res.send(`This is where I come to edit my sighting: ${req.params.sightingId}`)
})

module.exports = router;
