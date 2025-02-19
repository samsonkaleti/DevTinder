const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, "Shyam@123");
    const user = await User.findOne({ _id: payload._id });
    if (!user) return res.status(400).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.json({ message: err.message });
  }
};

module.exports = userAuth;
