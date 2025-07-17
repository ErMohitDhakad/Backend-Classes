const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes/userRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5932;
const MONGO_URL = process.env.MONGO_URL
app.use(
  cors({
    // origin:"http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.static('assets'));

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
