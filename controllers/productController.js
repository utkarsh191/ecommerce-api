const Product = require("../models/Product");

const addProduct = async(req, res) => {
  const { name, price, description, category, image, stock} = req.body;

  if(!name || !price || !description || !category ) {
    return res.status(400).json({
      messgae: "All required fields are required"
    });
  }

  const prroduct = await Product.create({
    name,
    price,
    description,
    category,
    image,
    stock
  });
  
  return res.status(201).json({
    message: "product added successfully",
  })
};

const getAllProducts = async (req, res) => {
  const products = await  Product.find();

  return res.status(200).json({
    products
  });
};

const getProductById = async (req, res) => {
  const{ id } = req.params;

  const product = await Product.findById(id);

  if(!product) {
    return res.status(404).json({
      messgae: "Product not found"
    });
  }

  return res.status(200).json({
    product
  });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true
    }
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found";
      product
    });
  }
};

const deleteProduct = async (req, res) => {
  const{ id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if(!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  return res.status(200).json({
    message: "Product deleted successfully"
  });
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};