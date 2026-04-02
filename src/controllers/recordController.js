const FinancialRecord = require("../models/financialRecord.model");

const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await FinancialRecord.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Financial record created successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create financial record",
      data: null,
    });
  }
};

const getAllRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        query.date.$gte = new Date(startDate);
      }

      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [records, totalRecords] = await Promise.all([
      FinancialRecord.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNumber)
        .populate("createdBy", "name email role"),
      FinancialRecord.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Financial records fetched successfully",
      data: {
        records,
        pagination: {
          total: totalRecords,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch financial records",
      data: null,
    });
  }
};

const getRecordById = async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("createdBy", "name email role");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Financial record not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Financial record fetched successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch financial record",
      data: null,
    });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Financial record not found",
        data: null,
      });
    }

    if (amount !== undefined) {
      record.amount = amount;
    }

    if (type !== undefined) {
      record.type = type;
    }

    if (category !== undefined) {
      record.category = category;
    }

    if (date !== undefined) {
      record.date = date;
    }

    if (notes !== undefined) {
      record.notes = notes;
    }

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Financial record updated successfully",
      data: record,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update financial record",
      data: null,
    });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Financial record not found",
        data: null,
      });
    }

    record.isDeleted = true;
    await record.save();

    return res.status(200).json({
      success: true,
      message: "Financial record deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete financial record",
      data: null,
    });
  }
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
};
