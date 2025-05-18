const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getUsers);

module.exports = router;
