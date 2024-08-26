const User = require("../models/User");

const ownerAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "No user found in request" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }
    if (user.role !== "owner") {
      return res.status(403).json({ msg: "User is not an owner" });
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Server error in ownerAuth", error: err.message });
  }
};

module.exports = ownerAuth;
