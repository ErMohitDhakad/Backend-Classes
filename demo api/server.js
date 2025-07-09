const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes/userRoute");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/myDatabase")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error("failed to connect to database: ", err);
  });

app.use("/", router);
app.listen(5932, () => {
  console.log("server is running....");
});
