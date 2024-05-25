const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get("/:sightingId", (req, res) => {
    res.send(`This is a particular sighting: ${req.params.sightingId}.`)
})

module.exports = router;
