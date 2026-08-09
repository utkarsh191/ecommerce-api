const mongoose = require("mongoose");

const userSchema = new mongooseSchema({
  name: String,
  email: String,
  password: String,

});

const user = mongoose.Model("User", userSchema);

module.exports = User;
