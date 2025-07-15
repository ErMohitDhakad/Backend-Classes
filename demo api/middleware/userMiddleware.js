exports.numberValidation = async (req, res, next) => {
  const { contact } = req.body;
  if (!contact) {
    return res.status(400).json({ msg: "Contact is Required" });
  }

  const validContact = /^\/91\d{10}$/;
  if (!validContact.test(contact)) {
    return res
      .status(400)
      .json({ msg: "Please enter a valid 10 digit number." });
  }

  next();
};
