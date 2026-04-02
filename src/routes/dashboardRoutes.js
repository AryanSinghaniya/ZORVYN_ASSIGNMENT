const express = require("express");

const {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
  getTrends,
} = require("../controllers/dashboardController");
const { authMiddleware } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");

const router = express.Router();

router.use(authMiddleware, authorize("admin", "analyst", "viewer"));

router.get("/summary", getSummary);
router.get("/trends", getTrends);
router.get("/category-totals", getCategoryTotals);
router.get("/recent-activity", getRecentActivity);
router.get("/monthly-trends", getMonthlyTrends);

module.exports = router;
