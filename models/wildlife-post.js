// here ios our first schema
// Every schema needs the mongoose dependancies
const mongoose = require("mongoose");

// Set up the properties of our schema
const wildlifePostSchema = new mongoose.Schema(
  {
    // every schema requires an ID
    _id: mongoose.Schema.Types.ObjectId,
    image_url: String,
    title: String,
    location: String,
    caption: String,
    comments: [],
    author_name: String,
    author_image_url: String,
    author_id: String,
    created: String

  },
  {
    // version keys can help us with updated schemas for larger projects
    versionKey: false,
  }
);

// set up an export telling this .js file to be sent to our main index.js
// first argument is the name of the schema
// this word is up to us but should reflect the type of data (singular)
// the second argument is the schema variable we declared above.
module.exports = mongoose.model("WildlifePost", wildlifePostSchema);
