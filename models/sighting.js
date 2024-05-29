const mongoose = require("mongoose");
const Comment = require("./comment");

const sightingSchema = new mongoose.Schema({
    location: {
        type: String, 
        required: true, 
    },
    date: {
        type: String,
        required: false,
    },
    time: {
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
        required: false, 
    },
    publisher: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false,
    },
    comments: [Comment.schema],
},
    { timestamps: true },
);

const Sighting = mongoose.model('Sighting', sightingSchema);

module.exports = Sighting;