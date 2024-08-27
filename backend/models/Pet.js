const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pettype: { type: String, enum: ["cat", "dog", "fish", "bird"], required: true },
  breed: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["available", "adopted"], default: "available" },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  adoptedDate: { type: Date },
});

module.exports = mongoose.model("Pet", petSchema);
