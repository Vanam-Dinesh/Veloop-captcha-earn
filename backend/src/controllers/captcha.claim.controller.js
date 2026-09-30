const CaptchaChallenge = require("../models/CaptchaChallenge");

const claimCaptchaReward = async (req, res) => {
  try {
    const { challengeId } = req.body;
    const userId = req.user._id;

    if (!challengeId) {
      return res.status(400).json({
        success: false,
        message: "challengeId is required.",
      });
    }

    // Atomic update:
    // Only one request can change PENDING -> CLAIMED.
    const challenge = await CaptchaChallenge.findOneAndUpdate(
      {
        challengeId,
        userId,
        status: "COMPLETED",
        rewardStatus: "PENDING",
        rewardAmount: { $gt: 0 },
      },
      {
        $set: {
          rewardStatus: "CLAIMED",
        },
      },
      {
        returnDocument: "after",
      }
    );

    if (!challenge) {
      const existingChallenge = await CaptchaChallenge.findOne({
        challengeId,
        userId,
      });

      if (!existingChallenge) {
        return res.status(404).json({
          success: false,
          message: "CAPTCHA challenge not found.",
        });
      }

      if (existingChallenge.rewardStatus === "CLAIMED") {
        return res.status(409).json({
          success: false,
          message: "Reward has already been claimed.",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Reward is not available to claim.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reward claimed successfully.",
      reward: {
        amount: challenge.rewardAmount,
        currency: "GEM",
        status: "CLAIMED",
      },
    });
  } catch (error) {
    console.error("Claim reward error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to claim reward.",
    });
  }
};

module.exports = {
  claimCaptchaReward,
};