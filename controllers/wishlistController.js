const Wishlist =require("../models/Wishlist");
const Product = require("../models/Product");

const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  ///check product exists
  const product = await Product.findById(productId);

  if(!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

    //Find user wishlist
    let wishlist = await Wishlist.findOne({
      user: req.user.userId
    });

    //if wishlist doesn't exist, create it
    if(!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.userId,
        products:[productId]
      });

      return res.status(201).json({
        message: "Product added to wishlist",
      });
    }

    //Check product already exists
    const alreadyExists = wishlist.products.some(
      id => id.toString() === productId
    );

    if(alreadyExists) {
      return res.status(400).json({
        message: "Product already in wishlist"
      });
    } 

    //Add product
    wishlist.products.push(productId);

    await wishlist.save();

    return res.status(200).json({
      message: "produxt added to wishlist",
      wishlist
    });
  };

  const getMyWishlist = async (req,res) => {
    const wishlist = await Wishlist.findOne({
      user: req.user.userId
    }).populate("products");

    if(!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found"
      });
    }
    return res.status(200).json({
      wishlist
    })
  }

  module.exports = {
    addToWishlist,
    getMyWishlist
  };