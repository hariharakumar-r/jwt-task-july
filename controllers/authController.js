const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = createToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.profile = async (req, res) => {
  const user = req.user; // from authMiddleware
  res.json({ user });
};
