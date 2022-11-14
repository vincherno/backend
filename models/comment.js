const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    text: String,
    comment_author_id: {
        type: mongoose.Schema.Types.String,
        ref: "User"
    },
    comment_author_name: {
        type: mongoose.Schema.Types.String,
        ref: "User"
    },
    comment_author_image_url: {
        type: mongoose.Schema.Types.String,
        ref: "User"
    },
    wildlife_post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WildlifePost"
    },
});

module.exports = mongoose.model("Comment", commentSchema)