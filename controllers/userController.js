const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return res.status(201).json({
    message: "User registered successfully",
    user
  });
};

const loginUser = async (req, res) => {

  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }
  const user = await User.findOne({ email });

  if(!user) {
    return res.status(400).json({
      message: "Invalif email or password"
    });
  }

  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid email or password"
    });
  }

  return res.status(200).json({
    message: "Login successful",
    user
  });

}

module.exports = {
  registerUser,
  loginUser
};