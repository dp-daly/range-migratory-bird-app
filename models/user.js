const mongoose = require("mongoose");
const { Sighting, Favourite } = require('./sighting');


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
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sightings: [Sighting.schema],
    favourites: [Favourite.schema],
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;