const { body } = require("express-validator");

const createUserValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "analyst", "viewer"])
    .withMessage("Role must be one of admin, analyst, or viewer"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

const updateUserValidation = [
  body("role")
    .optional()
    .isIn(["admin", "analyst", "viewer"])
    .withMessage("Role must be one of admin, analyst, or viewer"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
  body().custom((value) => {
    const hasAllowedField = Object.prototype.hasOwnProperty.call(value, "role") ||
      Object.prototype.hasOwnProperty.call(value, "status");

    if (!hasAllowedField) {
      throw new Error("At least one of role or status is required");
    }

    return true;
  }),
];

const updateRoleValidation = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "analyst", "viewer"])
    .withMessage("Role must be one of admin, analyst, or viewer"),
];

const updateStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "inactive"])
    .withMessage("Status must be either active or inactive"),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  updateRoleValidation,
  updateStatusValidation,
};
