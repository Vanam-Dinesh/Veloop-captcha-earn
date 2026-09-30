const {
  getCaptchaHistory,
} = require("../controllers/captcha.history.controller");
const express = require("express");

const authenticate = require("../middleware/auth.middleware");

const {
  createNewCaptcha,
} = require("../controllers/captcha.controller");

const {
  verifyCaptcha,
} = require("../controllers/captcha.verify.controller");

const {
  claimCaptchaReward,
} = require("../controllers/captcha.claim.controller");

const router = express.Router();

router.get("/new", authenticate, createNewCaptcha);

router.post("/verify", authenticate, verifyCaptcha);

router.post("/claim", authenticate, claimCaptchaReward);

router.get("/history", authenticate, getCaptchaHistory);

module.exports = router;