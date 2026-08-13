const express = require("express");
const router = express.Router();

const {
  addToWishlist, getMyWishlist, removeFromWishlist, moveWishlistToCart
} = require("../controllers/wishlistController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addToWishlist);
router.get("/", authMiddleware, getMyWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);
router.post("/move-to-cart", authMiddleware, moveWishlistToCart);

module.exports = router;
