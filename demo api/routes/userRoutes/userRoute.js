const express = require("express");
const userController = require("../../conrtoller/userController/userController");

const router = express.Router();

router.post("/addUser", userController.addUser);
router.get("/getAllUsers", userController.getUsers);
router.delete("/deleteUser/:id", userController.deleteUser);
router.delete("/deleteByEmail", userController.deleteUserByEmail);
router.put('/updateUserById/:id', userController.updateUser);
router.put('/updateTheUser/:id', userController.updateTheUser);
module.exports = router;
