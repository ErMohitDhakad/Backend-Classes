const UserModel = require("../../models/users/userModel");
const bcrypt = require("bcrypt");

exports.addUser = async (req, res) => {
  // const { fullname, username, contact, email } = req.body;
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
