const mongoose = require("mongoose");

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either income or expense",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const FinancialRecord = mongoose.model("FinancialRecord", financialRecordSchema);

module.exports = FinancialRecord;
