const express = require('express');
const router = express.Router();

router.get("/:userId", (req, res) => {
    res.send("This is my perch.")
})

router.get("/:userId/new-sighting", (req, res) => {
    res.send('This is where I will add a sighting')
})

router.get("/:userId/:sightingId/edit", (req, res) => {
    res.send(`This is where I come to edit my sighting: ${req.params.sightingId}`)
})

module.exports = router;
