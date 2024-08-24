const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "staff"], default: "staff" },
});

userSchema.statics.isOwnerExists = async function () {
  return await this.exists({ role: "owner" });
};

module.exports = mongoose.model("User", userSchema);
