const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    commenter: {type: mongoose.Schema.ObjectId, required: true, ref: "User"},
},
    { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;