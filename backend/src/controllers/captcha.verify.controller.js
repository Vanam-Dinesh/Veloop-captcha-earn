const crypto = require("crypto");
const mongoose = require("mongoose");

const CaptchaChallenge = require("../models/CaptchaChallenge");
const CaptchaAttempt = require("../models/CaptchaAttempt");
const GemTransaction = require("../models/GemTransaction");
const Wallet = require("../models/Wallet");

const {
  calculateCaptchaReward,
} = require("../services/reward.service");

const verifyCaptcha = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { challengeId, selectedOption } = req.body;
    const userId = req.user._id;

    if (!challengeId || !selectedOption) {
      return res.status(400).json({
        success: false,
        message: "challengeId and selectedOption are required.",
      });
    }

    let verificationResult;

    await session.withTransaction(async () => {
      const challenge = await CaptchaChallenge.findOne({
        challengeId,
        userId,
      })
        .select("+correctOption")
        .session(session);

      if (!challenge) {
        const error = new Error("CAPTCHA challenge not found.");
        error.statusCode = 404;
        throw error;
      }

      if (challenge.status !== "ACTIVE") {
        const error = new Error(
          "This CAPTCHA challenge has already been used."
        );
        error.statusCode = 409;
        throw error;
      }

      if (new Date() > challenge.expiresAt) {
        challenge.status = "EXPIRED";
        await challenge.save({ session });

        const error = new Error("This CAPTCHA challenge has expired.");
        error.statusCode = 410;
        throw error;
      }

      const isCorrect =
        selectedOption === challenge.correctOption;

      const rewardData = await calculateCaptchaReward(isCorrect);

      const wallet = await Wallet.findOne({
        userId,
      }).session(session);

      if (!wallet) {
        const error = new Error("Wallet not found.");
        error.statusCode = 404;
        throw error;
      }

      const balanceBefore = wallet.gems;
      const balanceAfter = balanceBefore + rewardData.amount;

      challenge.selectedOption = selectedOption;
      challenge.result = isCorrect
        ? "CORRECT"
        : "INCORRECT";
      challenge.rewardAmount = rewardData.amount;
      challenge.rewardStatus = "PENDING";
      challenge.status = "COMPLETED";
      challenge.completedAt = new Date();

      await challenge.save({ session });

      wallet.gems = balanceAfter;

      await wallet.save({ session });

      await GemTransaction.create(
        [
          {
            transactionId: crypto.randomUUID(),
            userId,
            currency: rewardData.currency,
            amount: rewardData.amount,
            type: "CAPTCHA_REWARD",
            referenceId: challenge.challengeId,
            balanceBefore,
            balanceAfter,
            status: "COMPLETED",
          },
        ],
        { session }
      );

      await CaptchaAttempt.create(
        [
          {
            attemptId: crypto.randomUUID(),
            challengeId: challenge.challengeId,
            userId,
            selectedOption,
            result: isCorrect
              ? "CORRECT"
              : "INCORRECT",
            reward: rewardData.amount,
            status: "COMPLETED",
            ipAddress: req.ip,
          },
        ],
        { session }
      );

      verificationResult = {
        result: isCorrect
          ? "CORRECT"
          : "INCORRECT",
        reward: {
          amount: rewardData.amount,
          currency: rewardData.currency,
          status: "PENDING",
        },
      };
    });

    return res.status(200).json({
      success: true,
      ...verificationResult,
    });
  } catch (error) {
    console.error("Verify CAPTCHA error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Unable to verify CAPTCHA.",
    });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  verifyCaptcha,
};