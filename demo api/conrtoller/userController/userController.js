const UserModel = require("../../models/users/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const SECRET_KEY = process.env.SECRET_KEY;

// api to create user
exports.addUser = async (req, res) => {
  // const { fullname, username, contact, email } = req.body;
  // extracting user data from body
  const body = req.body;

  if (
    !body ||
    !body.fullname ||
    !body.username ||
    !body.contact ||
    !body.email
  ) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    const data = await UserModel.create({
      fullname: body.fullname,
      username: body.username,
      contact: body.contact,
      email: body.email,
      password: hashedPassword,
    });

    console.log("userData ------------", data);
    return res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    console.error("error fetching data from body", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error.", Error: err.message });
  }
};

// api to get user data using find
exports.getUsers = async (req, res) => {
  try {
    // const data = await UserModel.find({}, { fullname: 1, email: 1, _id:0 });
    const data = await UserModel.find({});
    if (!data) {
      return res.status(404).json({ message: "No Records Found" });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// api to delete user based on id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID is Required" });
    }
    const result = await UserModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "No Record Found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// api to delete user based on email
exports.deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is Required" });
    }
    const result = await UserModel.findOneAndDelete({ email: email.trim() });
    if (!result) {
      return res.status(404).json({ message: "No Record Found" });
    }
    return res.status(200).json({ message: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// api to update user using long way
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is Required" });
    }
    const { fullname, username, contact, email, password } = req.body;
    const updatedUser = {};
    if (fullname) updatedUser.fullname = fullname;
    if (username) updatedUser.username = username;
    if (contact) updatedUser.contact = contact;
    if (email) updatedUser.email = email;
    if (password) updatedUser.password = password;

    const result = await UserModel.findByIdAndUpdate(
      id,
      { $set: updatedUser },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Id does not found" });
    }
    return res.status(200).json({
      message: "User is Updated Successfully",
      updatedData: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to Update User" });
  }
};

// api to updateUser in a easy way
exports.updateTheUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is Required" });
    }
    const { fullname, username, contact, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModel.findByIdAndUpdate(
      id,
      {
        fullname,
        username,
        contact,
        email,
        password: hashedPassword,
      },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res
      .status(200)
      .json({ msg: "User is Updated Successfully", user: result });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// api for login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "Username and Password is Required" });
  }
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    // const validPassword = user.password === password;
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({ msg: "Login Successful", token });
  } catch (err) {
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

