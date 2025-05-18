const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", protect, register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
