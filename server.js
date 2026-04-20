const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

// Order schema
const Order = mongoose.model("Order", {
  name: String,
  product: String,
  quantity: String
});

// Save order
app.post("/order", async (req, res) => {
  try {
    await new Order(req.body).save();
    res.send("Order Saved");
  } catch (err) {
    res.status(500).send("Error saving order");
  }
});

// ✅ IMPORTANT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});