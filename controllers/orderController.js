const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
  const { coupon } = req.body;

  const cart = await Cart.findOne({
    user: req.user.userId
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({
      message: "Cart is empty"
    });
  }

  let subtotal = 0;

  cart.items.forEach(item => {
    subtotal += item.product.price * item.quantity;
  });

  const tax = subtotal * 0.18;

  let deliveryCharge = 0;

  if (subtotal < 1000) {
    deliveryCharge = 100;
  }

  let discount = 0;

  if (coupon === "SAVE10") {
    discount = subtotal * 0.10;
  }

  const total =
    subtotal + tax + deliveryCharge - discount;

  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price
  }));

  const order = await Order.create({
    user: req.user.userId,
    items: orderItems,
    subTotal: subtotal,
    tax,
    deliveryCharge,
    discount,
    total
  });

  cart.items = [];

  await cart.save();

  return res.status(201).json({
    message: "Order created successfully",
    order
  });
};

module.exports = {
  createOrder
};