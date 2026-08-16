 const express = require("express");

 const router = express.Router();

 const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

 const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

//post,put,delete mee authMiddleware, adminMiddleware, yee sab issliye likhe hai q ki ye sirf admin change kare use naa kar paye.

 router.get("/",  getAllProducts);
 router.get("/:id", getProductById);
 router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
 router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
 router.post("/", authMiddleware, adminMiddleware, upload.single("image"), addProduct);

 module.exports = router;