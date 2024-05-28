const mongoose = require("mongoose");
const Sighting = require('./sighting');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    age: {
        type: Number,
    },
    location: {
        type: String,
    },
    password: {
      type: String,
    },
    favourites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Sighting',
    }],
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;