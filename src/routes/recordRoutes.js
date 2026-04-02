const express = require("express");

const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require("../controllers/recordController");
const { authMiddleware } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { validate } = require("../middleware/validate.middleware");
const {
  createRecordValidation,
  updateRecordValidation,
} = require("../validations/record.validation");

const router = express.Router();

router.use(authMiddleware);

router.post("/", authorize("admin"), createRecordValidation, validate, createRecord);

router.get("/", authorize("admin", "analyst", "viewer"), getAllRecords);
router.get("/:id", authorize("admin", "analyst", "viewer"), getRecordById);

router.put("/:id", authorize("admin"), updateRecordValidation, validate, updateRecord);
router.patch("/:id", authorize("admin"), updateRecordValidation, validate, updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

module.exports = router;
