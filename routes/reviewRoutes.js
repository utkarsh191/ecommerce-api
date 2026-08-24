const express = require("express");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Product reviews
router.get("/product/:productId", getProductReviews);

// Create review
router.post("/product/:productId", protect, createReview);

// Update review
router.put("/:reviewId", protect, updateReview);

// Delete review
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;