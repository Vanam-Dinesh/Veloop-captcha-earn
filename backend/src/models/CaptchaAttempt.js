const mongoose = require("mongoose");

const captchaAttemptSchema = new mongoose.Schema(
  {
    attemptId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    challengeId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    selectedOption: {
      type: String,
      required: true,
    },

    result: {
      type: String,
      enum: ["CORRECT", "INCORRECT"],
      required: true,
    },

    reward: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["COMPLETED", "REJECTED"],
      default: "COMPLETED",
    },

    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CaptchaAttempt",
  captchaAttemptSchema
);