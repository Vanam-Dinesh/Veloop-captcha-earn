const mongoose = require("mongoose");

const captchaRewardConfigSchema = new mongoose.Schema(
  {
    correctReward: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },

    wrongReward: {
      type: Number,
      required: true,
      default: 0.5,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "GEM",
      enum: ["GEM"],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CaptchaRewardConfig",
  captchaRewardConfigSchema
);