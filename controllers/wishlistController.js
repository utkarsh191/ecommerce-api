const Wishlist =require("../models/Wishlist");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

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
        wishlist
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
      message: "product added to wishlist",
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

  const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({
    user: req.user.userId
  });

  if (!wishlist) {
    return res.status(404).json({
      message: "Wishlist not found"
    });
  }

  const productExists = wishlist.products.some(
    id => id.toString() === productId
  );

  if (!productExists) {
    return res.status(404).json({
      message: "Product not found in wishlist"
    });
  }

  wishlist.products = wishlist.products.filter(
    id => id.toString() !== productId
  );

  await wishlist.save();

  return res.status(200).json({
    message: "Product removed from wishlist",
    wishlist
  });
};

const moveWishlistToCart = async (req, res) => {
  const { productId } = req.body;

  // Find user's wishlist
  const wishlist = await Wishlist.findOne({
    user: req.user.userId
  });

  if (!wishlist) {
    return res.status(404).json({
      message: "Wishlist not found"
    });
  }

  // Check product exists in wishlist
  const productExists = wishlist.products.some(
    id => id.toString() === productId
  );

  if (!productExists) {
    return res.status(404).json({
      message: "Product not found in wishlist"
    });
  }

  // Find user's cart
  let cart = await Cart.findOne({
    user: req.user.userId
  });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = await Cart.create({
      user: req.user.userId,
      items: [
        {
          product: productId,
          quantity: 1
        }
      ]
    });
  } else {
    // Check if product already exists in cart
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: 1
      });
    }

    await cart.save();
  }

  // Remove product from wishlist
  wishlist.products = wishlist.products.filter(
    id => id.toString() !== productId
  );

  await wishlist.save();

  return res.status(200).json({
    message: "Product moved from wishlist to cart",
    cart,
    wishlist
  });
};



  module.exports = {
    addToWishlist,
    getMyWishlist,
    removeFromWishlist,
    moveWishlistToCart
  };