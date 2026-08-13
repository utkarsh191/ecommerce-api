const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
const { productId, quantity } = req.body;

const product = await Product.findById(productId);

if(!product) {
  return res.status(404).json({
    message: "Product not found"
  });
}

const cart = await Cart.findOne({ user: req.user.userId });

if(!cart) {
  const newCart = await Cart.create({
    user: req.user.userId,
    items: [
      {
        product: productId,
        quantity
      }
    ]
  });

  return res.status(201).json({
    message: "Product added to cart",
    cart: newCart
  })
}
// item => ,cart.items ke andar jo bhi ek-ek item milega, usko temporary naam item de do.
//Mongoose me item.product generally ObjectId hota hai.
//Lekin req.body se jo productId aata hai, wo normally string hota hai:
const existingItem = cart.items.find(
  item => item.product.toString() === productId
);

if(existingItem) {
  existingItem.quantity += quantity;
} else{
  cart.items.push({
    product: productId,
    quantity 
  });
}

await cart.save();

return res.status(200).json({
  message: "Product added to cart",
  cart
});
};

const getMyCart = async (req, res) => {
  const cart = await Cart.findOne({
    user: req.user.userId
  }).populate("items.product");

  if(!cart) {
    return res.status(404).json({
      message: "Cart not found"
    });
  }

   let subtotal = 0;

  cart.items.forEach(item => {
    subtotal += item.product.price * item.quantity;
  });

  let tax = subtotal * 0.18;

  let deliveryCharge = 0;

  if(subtotal < 1000) {
    deliveryCharge = 100;
  }

  let total = subtotal + tax + deliveryCharge;


  return res.status(200).json({
    cart,
    subtotal,
    tax,
    deliveryCharge,
    total
  });
};

const removeFromCart = async (req,res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({
    user: req.user.userId
  });

  if(!cart) {
    return res.status(404).json({
      message: "Cart not found"
    });
  }


  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  return res.status(200).json({
    message: "Product removed from cart",
    cart
  });

};

const updateQuantity = async (req, res) => {

  const { productId } = req.params;
  const { quantity } = req.body;


  const cart = await Cart.findOne({
    user: req.user.userId
  });

  if(!cart) {
    return res.status(404).json({
      message: "Cart not found"
  }); 
}

const item = cart.items.find(
  item => item.product.toString() === productId
);

if(!item) {
  return res.status(404).json({
    message: "Product not found in cart"
  });
}

item.quantity = quantity;

await cart.save();

return res.status(200).json({
  message: "Cart quantity updated successfully",
  cart
});

};

  
module.exports = {
  addToCart,
  getMyCart,
  removeFromCart,
  updateQuantity
}
