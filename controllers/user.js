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
    const userInDb = await User.findById(currentUser).populate({
        path: 'favourites',
        populate: { path: 'publisher' }
    });
    const sightings = await Sighting.find({ publisher: currentUser }).populate();
    const reversedSightings = sightings.slice().reverse();
    res.render("../views/auth/perch.ejs", {
        name: userInDb.firstname,
        favourites: userInDb.favourites,
        sightings: reversedSightings,
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
    try {
        const foundSighting = await Sighting.findById(req.params.sightingId);
        const publisher = foundSighting.publisher.toString();
        if (req.params.userId === publisher) {
            res.render("../views/sighting/edit-sighting.ejs", {
                foundSighting,
            });
        } else {
            res.redirect("/");
        }
    } catch (err) {
        res.render("error.ejs", {
            systemErrorMessage: err.message,
        });
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
    res.redirect(`/community/${req.params.userId}`);
    } catch (err) {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

router.post("/:userId/:sightingId/favourites", async (req, res) => {
    try {

    const currentUser = req.session.user;
    const userInDb = await User.findById(currentUser);

    const favouriteInDb = userInDb.favourites.includes(req.params.sightingId);
    if (favouriteInDb === false) {
    userInDb.favourites.push(req.params.sightingId);

    await userInDb.save();

    res.redirect(`/community/${req.params.userId}`);

    } else {
        req.session.message = "This sighting is already in your favourites"
        res.redirect(`/community/${req.params.userId}`);
    }
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
        commenterId: `${commenter._id}`,
    };
    foundSighting.comments.push(newComment);
    await foundSighting.save();
    res.redirect(`/sighting/${req.params.sightingId}`)
    } catch (err) {
        res.render("error.ejs", {systemErrorMessage: err.message});
    };
});

module.exports = router;
