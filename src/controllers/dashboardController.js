const FinancialRecord = require("../models/financialRecord.model");

const getSummary = async (req, res) => {
  try {
    const summary = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    summary.forEach((item) => {
      if (item._id === "income") {
        totalIncome = item.total;
      }

      if (item._id === "expense") {
        totalExpenses = item.total;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      data: null,
    });
  }
};

const getCategoryTotals = async (req, res) => {
  try {
    const categoryTotals = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          totalRecords: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          totalRecords: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Category totals fetched successfully",
      data: categoryTotals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category totals",
      data: null,
    });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const recentRecords = await FinancialRecord.find({ isDeleted: false })
      .sort({ date: -1 })
      .limit(5)
      .populate("createdBy", "name email role");

    return res.status(200).json({
      success: true,
      message: "Recent activity fetched successfully",
      data: recentRecords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity",
      data: null,
    });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const monthlyTrends = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0],
            },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1,
          netBalance: { $subtract: ["$income", "$expense"] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Monthly trends fetched successfully",
      data: monthlyTrends,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly trends",
      data: null,
    });
  }
};

const getTrends = async (req, res) => {
  try {
    const period = req.query.period || "monthly";

    if (!["monthly", "weekly"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Use monthly or weekly",
        data: null,
      });
    }

    const groupId = period === "weekly"
      ? {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" },
          type: "$type",
        }
      : {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type",
        };

    const periodKey = period === "weekly"
      ? {
          year: "$_id.year",
          week: "$_id.week",
        }
      : {
          year: "$_id.year",
          month: "$_id.month",
        };

    const sortKey = period === "weekly"
      ? { "_id.year": 1, "_id.week": 1 }
      : { "_id.year": 1, "_id.month": 1 };

    const baseProjection = period === "weekly"
      ? {
          _id: 0,
          year: "$_id.year",
          week: "$_id.week",
          income: 1,
          expense: 1,
          netBalance: { $subtract: ["$income", "$expense"] },
        }
      : {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1,
          netBalance: { $subtract: ["$income", "$expense"] },
        };

    const trends = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: groupId,
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $group: {
          _id: periodKey,
          income: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "income"] }, "$totalAmount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$_id.type", "expense"] }, "$totalAmount", 0],
            },
          },
        },
      },
      { $sort: sortKey },
      { $project: baseProjection },
    ]);

    return res.status(200).json({
      success: true,
      message: `${period} trends fetched successfully`,
      data: trends,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trends",
      data: null,
    });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
  getTrends,
};
