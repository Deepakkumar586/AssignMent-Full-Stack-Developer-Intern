const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token is required" });

  // Check if the token is in the correct "Bearer <token>" format
  if (!token.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ message: "Token must be prefixed with 'Bearer '" });
  }

  // Extract token from the header
  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Invalid token:", err);
      return res
        .status(403)
        .json({ message: "Invalid Token", error: err.message });
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
