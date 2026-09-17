import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Get user from the token and attach to request (without password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Let them pass!
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
