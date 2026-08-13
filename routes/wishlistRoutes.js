const express = require("express");
const router = express.Router();

const {
  addToWishlist, getMyWishlist, removeFromWishlist
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getMyWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
