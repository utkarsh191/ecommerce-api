const express = require("express");
const router = express.Router();

const {
  addToWishlist, getMyWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getMyWishlist);

module.exports = router;
