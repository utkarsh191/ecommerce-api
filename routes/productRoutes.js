 const express = require("express");

 const router = express.Router();

 const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

 const authMiddleware = require("../middleware/authMiddleware");

 router.post("/", authMiddleware, addProduct);
 router.get("/",  getAllProducts);
 router.get("/:id", getProductById);
 router.put("/:id", authMiddleware, updateProduct);
 router.delete("/:id", authMiddleware, deleteProduct);

 module.exports = router;