const express = require("express");

const authenticate = require("../middleware/auth.middleware");
const {
  getWallet,
} = require("../controllers/wallet.controller");

const router = express.Router();

router.get("/gems", authenticate, getWallet);

module.exports = router;