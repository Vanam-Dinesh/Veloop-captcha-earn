const CaptchaRewardConfig = require("../models/CaptchaRewardConfig");

const getActiveRewardConfig = async () => {
  const config = await CaptchaRewardConfig.findOne({
    active: true,
  }).sort({ createdAt: -1 });

  if (config) {
    return config;
  }

  // Create the default configuration if none exists yet.
  return CaptchaRewardConfig.create({
    correctReward: 1,
    wrongReward: 0.5,
    currency: "GEM",
    active: true,
  });
};

const calculateCaptchaReward = async (isCorrect) => {
  const config = await getActiveRewardConfig();

  return {
    amount: isCorrect
      ? config.correctReward
      : config.wrongReward,
    currency: config.currency,
  };
};

module.exports = {
  getActiveRewardConfig,
  calculateCaptchaReward,
};