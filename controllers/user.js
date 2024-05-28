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
};

/*-------------------------------- Routes --------------------------------*/

router.get("/:userId", async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser).populate('favourites');
    const sightings = await Sighting.find({ publisher: currentUser }).populate();
    res.render("../views/auth/perch.ejs", {
        name: userInDb.firstname,
        favourites: userInDb.favourites,
        sightings,
    });
    } catch (err) {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

router.get("/:userId/new-sighting", (req, res) => {
    if (req.session.user) {
    try {
    getDate();
    res.render("../views/sighting/new-sighting.ejs", {
        date: dateToday,
    });
    } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
    };
} else {
    res.redirect("/auth/sign-in")
}
});

router.get("/:userId/:sightingId/edit", async (req, res) => {
    const foundSighting = await Sighting.findById(req.params.sightingId).populate('publisher')
    const publisher = foundSighting.publisher._id.toString();
    if (req.params.userId === publisher) {
        try {
    res.render("../views/sighting/edit-sighting.ejs", {
        foundSighting,
    });
    } catch (err) {
    res.render("error.ejs", {
        systemErrorMessage: err.message,
    });
    };
} else {
    res.redirect("/")
}
});

router.put("/:userId/:sightingId", async (req, res) => {
    try {
    const updatedSighting = await Sighting.findByIdAndUpdate(req.params.sightingId, req.body);
    res.redirect(`/sighting/${req.params.sightingId}`);
    } catch (err) {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

router.delete("/:userId/:sightingId", async (req, res) => {
    try {
    const deletedSighting = await Sighting.findByIdAndDelete(req.params.sightingId);
    console.log(deletedSighting);
    res.redirect(`/community/${req.params.userId}`);
    } catch (err) {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

router.post("/:userId/:sightingId/favourites", async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.favourites.push(req.params.sightingId);
    await userInDb.save();
    res.redirect(`/community/${req.params.userId}`);
    } catch (err) {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

router.delete("/:userId/:sightingId/favourites", async (req, res) => {
    try {
    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);
    userInDb.favourites.pull(req.params.sightingId)
    await userInDb.save();
    res.redirect(`/community/${req.params.userId}`)
    } catch {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

router.post("/:userId/:sightingId", async (req, res) => {
    try {
    const foundSighting = await Sighting.findById(req.params.sightingId);
    const commenter = await User.findById(req.params.userId);
    const newComment = {
        text: req.body.text,
        commenter: `${commenter.firstname} ${commenter.lastname}`,
    };
    foundSighting.comments.push(newComment);
    await foundSighting.save();
    res.redirect(`/sighting/${req.params.sightingId}`)
    } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

module.exports = router;
