const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes/userRoute");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const nodemailer = require("nodemailer");
const multer  = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5932;
const MONGO_URL = process.env.MONGO_URL;
app.use(
  cors({
    // origin:"http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.static("assets"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public"));

app.get("/view", (req, res) => {
  res.render("view", { title: "Developers", name: "Abhishek" });
});

app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  // Validate input
  if (!to || !subject || !message) {
    return res
      .status(400)
      .json({ error: "Please include to, subject, and message fields." });
  }

  // Create a transporter (Gmail example)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your_emailexample@gmail.com",
      pass: "", // Use Gmail app password
    },
  });

  // Email options
  const mailOptions = {
    from: "baba.mohit7697@gmail.com",
    to,
    subject,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent", id: info.messageId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to send email", details: error.message });
  }
});

const uploadDir = path.join(__dirname, 'uploads');

// ✅ Create the uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads folder created.');
}

// 📦 Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save file with timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 📤 Route to upload file
app.post('/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.send(`✅ File uploaded: ${req.file.filename}`);
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error("failed to connect to database: ", err);
  });

app.use("/", router);
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
