const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Bearer token missing." });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
    };
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalid or expired." });
  }
};
