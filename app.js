const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);

app.get("/", (req,res) => {
  res.send("Welcome to E-commerce API");
});

module.exports = app;