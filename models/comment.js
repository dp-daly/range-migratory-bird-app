const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    commenter: {type: String},
    commenterId: {type: String},
},
    { timestamps: true },
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;