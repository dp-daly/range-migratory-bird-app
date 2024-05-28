/*-------------------------------- Dependencies --------------------------------*/

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Sighting = require('../models/sighting.js');

/*-------------------------------- Date assignment to prefill new sighting form --------------------------------*/
let dateToday = ""

function getDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateToday = yyyy + '-' + mm + '-' + dd;
}

/*-------------------------------- Routes --------------------------------*/

router.get("/:userId", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser).populate('favourites');
    const sightings = await Sighting.find({ publisher: currentUser }).populate();
    res.render("../views/auth/perch.ejs", {
        name: userInDb.firstname,
        favourites: userInDb.favourites,
        sightings,
    });
});

router.get("/:userId/new-sighting", (req, res) => {
    getDate();
    res.render("../views/sighting/new-sighting.ejs", {
        date: dateToday,
    });
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
    const deletedSighting = await Sighting.findByIdAndDelete(req.params.sightingId);
    console.log(deletedSighting);
    res.redirect(`/community/${req.params.userId}`);
});

router.post("/:userId/:sightingId/favourites", async (req, res) => {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.favourites.push(req.params.sightingId);
    await userInDb.save();
    res.redirect(`/community/${req.params.userId}`);
});

router.delete("/:userId/:sightingId/favourites", async (req, res) => {
    console.log("WHACK")
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.favourites.pull(req.params.sightingId)
    await userInDb.save();
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

module.exports = router;
