const mongoose = require("mongoose");
const Sighting = require('./sighting');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true, 
    },
    lastname: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true, 
    },
    age: {
        type: Number,
        required: true, 
    },
    location: {
        type: String,
        required: true, 
    },
    password: {
      type: String,
      required: true,
    },
    favourites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Sighting',
    }],
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;