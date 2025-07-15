const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  contact: Number,
  email: String,
  password: String
},{
  timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
