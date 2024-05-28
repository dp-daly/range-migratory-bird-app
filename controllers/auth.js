/*-------------------------------- Dependencies --------------------------------*/
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

/*-------------------------------- Routes --------------------------------*/
router.get('/register', (req, res) => {
  try {
    res.render('auth/register.ejs');
  } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
  }
  });
  
router.get('/sign-in', (req, res) => {
  try {
    res.render('auth/sign-in.ejs');
  } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
  }
  });
  
router.get('/sign-out', (req, res) => {
  try {
  req.session.destroy(() => {
    res.redirect("/");
    });
  } catch (err) {
    res.render("error.ejs", {systemErrorMessage: err.message});
  }
  });

  router.post('/register', async (req, res) => {
    try {
      const userInDatabase = await User.findOne({ email: req.body.email });
      const validationErrors = [];

      if (userInDatabase) {
        validationErrors.push('There is already an account registered with that email address. Try signing in.');
      };
      if (req.body.password !== req.body.confirmPassword) {
        validationErrors.push('Password and Confirm Password must match');
      };
      if (!req.body.firstname.trim()) {
        validationErrors.push('Please provide your first name');
      }
      if (!req.body.lastname.trim()) {
        validationErrors.push('Please provide your last name');
      }
      if (!req.body.email.trim()) {
        validationErrors.push('Please provide your email address');
      }
      if (!req.body.age.trim()) {
        validationErrors.push('Please provide your age');
      }
      if (!req.body.location.trim()) {
        validationErrors.push('Please provide your home location');
      }
      if (!req.body.password.trim()) {
        validationErrors.push('Please provide a password');
      }
      if (!req.body.confirmPassword.trim()) {
        validationErrors.push('Please confirm your password');
      }

      if (validationErrors.length > 0) {
        res.render('../views/auth/register.ejs', { 
          valErrorMessages: validationErrors,
          formData: req.body,
        });
      } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
    
      await User.create(req.body);
      req.session.message = `Your account has been successfully created. Please sign in with your email address and password.`;

      res.redirect('/auth/sign-in');
      };
    } catch (err) {
      req.session.message = `There was an error registering your account: ${err.message}`;
      res.render('../views/auth/register.ejs', { 
        systemErrorMessage: err.message,
        formData: req.body,
      });
    }
  });



  router.post('/sign-in', async (req, res) => {
    
    const validationErrors = [];

    if (!req.body.password.trim()) {
      validationErrors.push("You must provide your email address")
    }

    if (!req.body.password.trim()) {
      validationErrors.push("You must provide your password")
    }

    if (validationErrors.length > 0) {
      return res.render('../views/auth/sign-in.ejs', { 
        valErrorMessages: validationErrors,
        formData: req.body,
      })
    };

    const userInDatabase = await User.findOne({ email: req.body.email });

      if (!userInDatabase) {
        req.session.message = "Login failed. Please try again.";
        return res.redirect('/auth/sign-in')
      }
    
      const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      if (!validPassword) {
        req.session.message = "Login failed. Please try again.";
        return res.redirect('/auth/sign-in')
      }
    

      req.session.user = {
        _id: userInDatabase._id,
        firstname: userInDatabase.firstname,
        email: userInDatabase.email,
        favourites: userInDatabase.favourites,
        sightings: userInDatabase.sightings,
      };

      req.session.save(() => {
        res.redirect("/");
      });

  });

  module.exports = router; 