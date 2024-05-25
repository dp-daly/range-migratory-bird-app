const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get("/", (req, res) => {
    res.send("This is the feed.")
})

router.post("/", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.sightings.push(req.body);
    await userInDb.save();
    res.send("Added to database!")
})

module.exports = router;
