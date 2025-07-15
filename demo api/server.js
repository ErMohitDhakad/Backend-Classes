const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/userRoutes/userRoute");
const cors = require('cors');


const app = express();
app.use(express.json());

app.use(cors({
  // origin:"http://localhost:3000",
  methods:["GET","POST","PATCH","PUT","DELETE"],
  credentials: true

}));

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
