const express = require("express");

const router = express.Router();

const { addToCart } = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware,addToCart);

module.exports = router;