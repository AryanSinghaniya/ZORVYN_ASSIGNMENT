const express = require("express");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { validate } = require("../middleware/validate.middleware");
const {
  createUserValidation,
  updateUserValidation,
  updateRoleValidation,
  updateStatusValidation,
} = require("../validations/user.validation");

const router = express.Router();

router.use(authMiddleware, authorize("admin"));

router.post("/", createUserValidation, validate, createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUserValidation, validate, updateUser);
router.patch("/:id/role", updateRoleValidation, validate, updateUserRole);
router.patch("/:id/status", updateStatusValidation, validate, updateUserStatus);

module.exports = router;
