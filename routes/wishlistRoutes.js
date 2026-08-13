const express = require("express");
const router = express.Router();

const {
  addToWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addToWishlist);

module.exports = router;
