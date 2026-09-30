const crypto = require("crypto");

const CaptchaChallenge = require("../models/CaptchaChallenge");
const { createCaptchaChallenge } = require("../services/captcha.service");

const createNewCaptcha = async (req, res) => {
  try {
    const userId = req.user._id;

    // Invalidate any previous active CAPTCHA for this user.
    await CaptchaChallenge.updateMany(
      {
        userId,
        status: "ACTIVE",
      },
      {
        $set: {
          status: "DISCARDED",
        },
      }
    );

    const captcha = createCaptchaChallenge();
    const challengeId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    const challenge = await CaptchaChallenge.create({
      challengeId,
      userId,
      captchaText: captcha.captchaText,
      options: captcha.options,
      correctOption: captcha.correctOption,
      status: "ACTIVE",
      expiresAt,
      rewardStatus: "NONE",
    });

    return res.status(201).json({
  success: true,
  challenge: {
    challengeId: challenge.challengeId,
    question: "Select the matching CAPTCHA",
    captchaText: challenge.captchaText,
    options: challenge.options,
    expiresAt: challenge.expiresAt,
  },
});
  } catch (error) {
    console.error("Create CAPTCHA error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create CAPTCHA challenge.",
    });
  }
};

module.exports = {
  createNewCaptcha,
};