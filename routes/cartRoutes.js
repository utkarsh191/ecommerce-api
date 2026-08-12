const express = require("express");

const router = express.Router();

const { addToCart, getMyCart, removeFromCart } = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware,addToCart);
router.get("/", authMiddleware, getMyCart);
router.delete("/:productId", authMiddleware, removeFromCart);


module.exports = router;