const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: String,
  pettype: String,
  breed: String,
  price: Number,
});

module.exports = mongoose.model('Pet', petSchema);
