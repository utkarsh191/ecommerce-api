const express = require("express");

const router = express.Router();

const { addToCart, getMyCart } = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware,addToCart);
router.get("/", authMiddleware, getMyCart);


module.exports = router;