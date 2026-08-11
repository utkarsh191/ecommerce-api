 const express = require("express");

 const router = express.Router();

 const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

 const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

//post,put,delete mee authMiddleware, adminMiddleware, yee sab issliye likhe hai q ki ye sirf admin change kare use naa kar paye.
 router.post("/", authMiddleware, adminMiddleware, addProduct);
 router.get("/",  getAllProducts);
 router.get("/:id", getProductById);
 router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
 router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

 module.exports = router;