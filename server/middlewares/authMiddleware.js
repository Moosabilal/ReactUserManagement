import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, error: "Access Denied! No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, error: "User not found." });
    }
    req.user = user; 
    next();
  } catch (error) {
    return res.status(403).json({ success: false, error: "Invalid or expired token." });
  }
};

export default authMiddleware;
