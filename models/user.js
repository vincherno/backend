const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  profile_image_url: String,
});

module.exports = mongoose.model("User", userSchema);
