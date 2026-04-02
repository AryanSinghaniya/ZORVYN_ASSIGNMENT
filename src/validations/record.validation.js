const { body } = require("express-validator");

const recordTypeValues = ["income", "expense"];

const createRecordValidation = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be numeric")
    .custom((value) => Number(value) > 0)
    .withMessage("Amount must be greater than 0"),

  body("type")
    .isIn(recordTypeValues)
    .withMessage("Type must be either income or expense"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("date")
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

const updateRecordValidation = [
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be numeric")
    .custom((value) => Number(value) > 0)
    .withMessage("Amount must be greater than 0"),

  body("type")
    .optional()
    .isIn(recordTypeValues)
    .withMessage("Type must be either income or expense"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),

  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string"),
];

module.exports = {
  createRecordValidation,
  updateRecordValidation,
};
