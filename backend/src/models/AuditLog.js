const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "USER_REGISTERED",
        "USER_LOGIN",
        "CAPTCHA_CREATED",
        "CAPTCHA_VERIFIED",
        "CAPTCHA_REJECTED",
        "REWARD_GRANTED",
        "REWARD_CLAIMED",
        "CAPTCHA_DISCARDED",
        "SECURITY_REJECTED",
      ],
    },

    referenceId: {
      type: String,
      default: null,
      index: true,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

module.exports = mongoose.model("AuditLog", auditLogSchema);