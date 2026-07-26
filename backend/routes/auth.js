const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/profile", authController.getProfile);
router.put("/profile", authController.updateProfile);
router.post("/logout", authController.logout);

module.exports = router;
