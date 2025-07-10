const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: String,
  username: String,
  contact: Number,
  email: String,
  password: String
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
