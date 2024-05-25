const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/register', (req, res) => {
    res.render('auth/register.ejs');
  });
  
  router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
  });
  
  router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  router.post('/register', async (req, res) => {
    try {
      const userInDatabase = await User.findOne({ email: req.body.email });
      if (userInDatabase) {
        return res.send('There is already an account registered with that email address. Try signing in.');
      }
    
      if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm Password must match');
      }
    
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hashedPassword;
    
      await User.create(req.body);
    
      res.redirect('/auth/sign-in');
    } catch (err) {
      console.log(err);
      res.redirect('/register')
      //! To return and add a flash message with error text on the register page rather than redirecting to an error page.
    }
  });

  router.post('/sign-in', async (req, res) => {
    try {
      const userInDatabase = await User.findOne({ email: req.body.email });
      if (!userInDatabase) {
        //! To return for more UX-friendly error handling.
        return res.send('Login failed. Please try again.');
      }
    
      const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      if (!validPassword) {
        return res.send('Login failed. Please try again.');
      }
    
      req.session.user = {
        _id: userInDatabase._id,
        firstname: userInDatabase.firstname,
        email: userInDatabase.email,
        favourites: userInDatabase.favourites,
        sightings: userInDatabase.sightings,
      };
    
      res.redirect('/');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    //! To return for more UX-friendly error handling.
    }
  });

  module.exports = router; 