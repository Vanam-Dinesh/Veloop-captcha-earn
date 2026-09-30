const mongoose = require("mongoose");

const captchaChallengeSchema = new mongoose.Schema(
  {
    challengeId: {
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

    captchaText: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (options) {
          return options.length === 4;
        },
        message: "A CAPTCHA challenge must have exactly 4 options.",
      },
    },

    // IMPORTANT:
    // This field is stored only on the backend.
    // It must NEVER be sent to the frontend.
    correctOption: {
      type: String,
      required: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "EXPIRED", "DISCARDED"],
      default: "ACTIVE",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    selectedOption: {
      type: String,
      default: null,
    },

    result: {
      type: String,
      enum: ["CORRECT", "INCORRECT", null],
      default: null,
    },

    rewardAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    rewardStatus: {
      type: String,
      enum: ["PENDING", "CLAIMED", "NONE"],
      default: "NONE",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CaptchaChallenge",
  captchaChallengeSchema
);