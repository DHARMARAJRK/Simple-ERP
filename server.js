const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB connect
mongoose.connect("YOUR_MONGO_URL")
.then(() => console.log("MongoDB Connected"));

// Schema
const Order = mongoose.model("Order", {
  name: String,
  product: String,
  quantity: String
});

// Admin (password: 123456)
const ADMIN = {
  email: "admin@sundeep.com",
  password: bcrypt.hashSync("123456", 10)
};

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN.email) return res.send("Wrong email");

  if (!bcrypt.compareSync(password, ADMIN.password))
    return res.send("Wrong password");

  const token = jwt.sign({ email }, "SECRET", { expiresIn: "1d" });

  res.json({ token });
});

// Middleware
const verify = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization, "SECRET");
    next();
  } catch {
    res.send("Unauthorized");
  }
};

// Order
app.post("/order", async (req, res) => {
  await new Order(req.body).save();
  res.send("Order Saved");
});

// Get Orders (protected)
app.get("/orders", verify, async (req, res) => {
  const data = await Order.find();
  res.json(data);
});

app.listen(5000, () => console.log("Server running"));