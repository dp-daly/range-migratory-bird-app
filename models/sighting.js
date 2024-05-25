const mongoose = require("mongoose");
const Comment = require("./comment");

const sightingSchema = new mongoose.Schema({
    location: {
        type: String, 
        required: true, 
    },
    time: {
        type: Number, 
        required: true, 
    },
    timezone: {
        type: String, 
        required: true, 
    },
    species: {
        type: String, 
        required: true, 
    },
    subspecies: {
        type: String, 
        required: false, 
    },
    rare: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String, 
        required: true, 
    },
    description: {
        type: String, 
        required: true, 
    },
    comments: [Comment.schema],
});

const favouriteSchema = new mongoose.Schema({
    favourite: {type: mongoose.Schema.ObjectId, required: true, ref: "Sighting"}
});

const Favourite = mongoose.model('Favourite', favouriteSchema);
const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = {
    Sighting,
    Favourite
};