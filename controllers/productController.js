const Product = require("../models/Product");

const addProduct = async(req, res) => {
  const { name, price, description, category, image, stock} = req.body;

  if(!name || !price || !description || !category ) {
    return res.status(400).json({
      message: "All required fields are required"
    });
  }

  const product = await Product.create({
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

  const { search, category, minPrice, maxPrice } = req.query;

  let query = {};

  // Search
  if (search) {
    query.name = {
      $regex: search,
      $options: "i"
    };
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const products = await Product.find(query);

  return res.status(200).json({
    products
  });
};

const getProductById = async (req, res) => {
  const{ id } = req.params;

  const product = await Product.findById(id);

  if(!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  return res.status(200).json({
    message: "Product found successfully",
    product
  });
}

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
      message: "Product not found"
    });
  }

  return res.status(200).json({
    message: "product updated successfully",
    product
  })
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