const Product = require("../models/Product");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const getAllProducts = async (req, res) => {

  const {
    search,
    category,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10
  } = req.query;

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

  // Sort
  let sort = {};

  if (req.query.sort) {
    const sortField = req.query.sort.startsWith("-")
      ? req.query.sort.substring(1)
      : req.query.sort;

    const sortOrder = req.query.sort.startsWith("-")
      ? -1
      : 1;

    sort[sortField] = sortOrder;
  }

  // Pagination
  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

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

const addProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  let imageUrl;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    imageUrl = result.secure_url;
  }

  const product = await Product.create({
    name,
    price,
    description,
    category,
    image: imageUrl,
    stock
  });

  return res.status(201).json({
    message: "Product added successfully",
    product
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProduct
};