const CaptchaAttempt = require("../models/CaptchaAttempt");

const getCaptchaHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(
      1,
      parseInt(req.query.page, 10) || 1
    );

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );

    const skip = (page - 1) * limit;

    const [attempts, total] = await Promise.all([
      CaptchaAttempt.find({ userId })
        .select("-ipAddress -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      CaptchaAttempt.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      history: attempts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get CAPTCHA history error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch CAPTCHA history.",
    });
  }
};

module.exports = {
  getCaptchaHistory,
};