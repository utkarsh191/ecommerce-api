const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Create Review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    // Recalculate rating
    const reviews = await Review.find({ product: productId });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    product.averageRating = totalRating / reviews.length;
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

// Get Product Reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get reviews",
    });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only review owner can update
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    // Recalculate product rating
    const reviews = await Review.find({
      product: review.product,
    });

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    const product = await Product.findById(review.product);

    if (product) {
      product.averageRating = totalRating / reviews.length;
      product.numReviews = reviews.length;

      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update review",
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only review owner can delete
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    // Recalculate product rating
    const reviews = await Review.find({
      product: productId,
    });

    const product = await Product.findById(productId);

    if (product) {
      if (reviews.length === 0) {
        product.averageRating = 0;
        product.numReviews = 0;
      } else {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );

        product.averageRating = totalRating / reviews.length;
        product.numReviews = reviews.length;
      }

      await product.save();
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};