const Wallet = require("../models/Wallet");

const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({
      userId: req.user._id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    return res.status(200).json({
      success: true,
      wallet: {
        gems: wallet.gems,
        currency: wallet.currency,
      },
    });
  } catch (error) {
    console.error("Get wallet error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch wallet.",
    });
  }
};

module.exports = {
  getWallet,
};