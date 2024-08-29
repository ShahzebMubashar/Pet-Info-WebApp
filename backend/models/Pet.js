const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["cat", "dog", "fish", "bird"], required: true },
  breed: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "adopted"],
    default: "available",
  },
  quantity: { type: Number, required: true, default: 1 },
});

module.exports = mongoose.model("Pet", petSchema);
