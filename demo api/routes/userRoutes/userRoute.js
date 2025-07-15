const express = require("express");
const userController = require("../../conrtoller/userController/userController");
const { numberValidation } = require("../../middleware/userMiddleware");

const router = express.Router();

router.post("/addUser", numberValidation, userController.addUser);
router.get("/getAllUsers", userController.getUsers);
router.delete("/deleteUser/:id", userController.deleteUser);
router.delete("/deleteByEmail", userController.deleteUserByEmail);
// using put method
// router.put("/updateUserById/:id", userController.updateUser);
// using patch method
router.patch("/updateUserById/:id", userController.updateUser);
router.put("/updateTheUser/:id", userController.updateTheUser);
router.post("/login", userController.loginUser);
module.exports = router;
