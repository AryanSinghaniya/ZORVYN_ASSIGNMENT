const express = require("express");

const { registerUser, loginUser, getMe } = require("../controllers/authController");
const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");
const { authMiddleware } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.get("/me", authMiddleware, getMe);

module.exports = router;
