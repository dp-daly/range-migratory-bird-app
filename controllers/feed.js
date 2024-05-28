const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Sighting = require('../models/sighting.js');

/*-------------------------------- Date assignment to prefill new sighting form in case of valErrors --------------------------------*/
//! Look into making date globally available in middleware to make this more DRY. 
let dateToday = ""

function getDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    dateToday = yyyy + '-' + mm + '-' + dd;
}


/*-------------------------------- Routes --------------------------------*/
router.get("/", async (req, res) => {
  try {
    const sightings = await Sighting.find().populate('publisher');
    res.render('../views/feed/feed.ejs', {
      sightings,
    });
  } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
  }
});

router.post("/", async (req, res) => {
  
  const validationErrors = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!req.body.location.trim()) {
    validationErrors.push('Please provide the location of your sighting');
  }
  if (!req.body.date.trim() || !dateRegex.test(req.body.date.trim())) {
    validationErrors.push('Please provide the date of your sighting in YYYY-MM-DD format');
  }
  if (!req.body.time.trim()) {
    validationErrors.push('Please provide the time of your sighting');
  }
  if (!req.body.species.trim()) {
    validationErrors.push('Please provide the species you sighted');
  }
  if (!req.body.image.trim()) {
    validationErrors.push('Please provide an image of your sighting');
  }

  if (validationErrors.length > 0) {
    getDate();
    res.render('../views/sighting/new-sighting.ejs', { 
      valErrorMessages: validationErrors,
      formData: req.body,
      date: dateToday,
    });
  } else {
    try {
    req.body.publisher = req.session.user;
    const sighting = await Sighting.create(req.body);
    req.session.message = `Your ${req.body.species} sighting has been successfully added to the migration feed.`;
    res.redirect(`/sighting/${sighting._id}`);
} catch (err) {
  req.session.message = `There was an error adding your sighting to the migration feed: ${err.message}`;
  res.render('../views/sighting/new-sighting.ejs', { 
    systemErrorMessage: err.message,
    formData: req.body,
  });
}
}
});



module.exports = router; 