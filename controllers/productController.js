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

module.exports = {
  addProduct
};