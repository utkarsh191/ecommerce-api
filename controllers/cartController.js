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

module.exports = {
  addToCart
}
