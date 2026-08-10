const mongoose = require("mongoose");

const userSchema = new mongooseSchema({
  name: String,
  email: String,
  password: String,

});

const user = mongoose.model("User", userSchema);

module.exports = User;
