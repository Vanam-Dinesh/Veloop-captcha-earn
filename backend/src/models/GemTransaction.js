const mongoose = require("mongoose");

const gemTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    currency: {
      type: String,
      required: true,
      default: "GEM",
      enum: ["GEM"],
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["CAPTCHA_REWARD"],
    },

    referenceId: {
      type: String,
      required: true,
      index: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
      min: 0,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      required: true,
      enum: ["COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GemTransaction",
  gemTransactionSchema
);