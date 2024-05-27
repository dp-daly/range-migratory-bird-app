const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { Sighting } = require('../models/sighting.js');

router.get("/:userId", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    const sightings = await Sighting.find({ publisher: currentUser }).populate();
    res.render("../views/auth/perch.ejs", {
        name: userInDb.firstname,
        sightings,
    });
});

router.get("/:userId/new-sighting", (req, res) => {
    res.render("../views/sighting/new-sighting.ejs");
});

router.get("/:userId/:sightingId/edit", async (req, res) => {
    //! To return: need to add restriction that stops people from editing others' posts if they can access their userId.
    const foundSighting = await Sighting.findById(req.params.sightingId);
    res.render("../views/sighting/edit-sighting.ejs", {
        foundSighting,
    });
});

router.put("/:userId/:sightingId", async (req, res) => {
    const updatedSighting = await Sighting.findByIdAndUpdate(req.params.sightingId, req.body);
    res.redirect(`/sighting/${req.params.sightingId}`)
})

router.delete("/:userId/:sightingId", async (req, res) => {
    const deletedSighting = await Sighting.findByIdAndDelete(req.params.sightingId)
    res.redirect(`/community/${req.params.userId}`)
})

router.post("/:userId/:sightingId", async (req, res) => {
    const foundSighting = await Sighting.findById(req.params.sightingId);
    const commenter = await User.findById(req.params.userId);
    const newComment = {
        text: req.body.text,
        commenter: `${commenter.firstname} ${commenter.lastname}`,
    };
    foundSighting.comments.push(newComment);
    await foundSighting.save();
    res.redirect(`/sighting/${req.params.sightingId}`)
})

router.post("/:userId/:sightingId/favourites", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    const foundSighting = await Sighting.findById(req.params.sightingId);
    userInDb.favourites.push(foundSighting)
    await userInDb.save();
    res.redirect(`/community/${req.params.userId}`)
})

module.exports = router;
