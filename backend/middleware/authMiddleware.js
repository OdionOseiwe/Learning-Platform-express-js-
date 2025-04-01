import jwt from "jsonwebtoken";
import  User  from "../Models/userModel.js";

export const verifyToken = (req, res, next) => {
  // Extract token from cookies
  const token = req.cookies.token;

  // Check if token exists
  if (!token) {
      return res.status(401).json({ success: false, msg: "No token provided" });
  }

  try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if decoded payload contains userId
      if (!decoded.userId) {
          return res.status(401).json({ success: false, msg: "Invalid token payload" });
      }

      // Attach userId to the request object
      req.userId = decoded.userId;

      // Proceed to the next middleware or route handler
      next();
  } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ success: false, msg: "Invalid token" });
  
  }
};

export const admin = (req, res, next) => {
  try {
    if (req.user && ( req.user.role === 'admin')){
      next();
    }
  } catch (error) {
    console.log("error while checking if user is admin", error);
    res.status(500).json({ msg: "User not an admin" });
  }
};

export const instructor = async (req, res, next) => {
  const user = await User.findById(req.userId);

  try {
    // Check if the user is authenticated and has the correct role
    if (user && (user.role === "instructor" || user.role === "admin")) {
      return next();
    } else {
      return res
        .status(403)
        .json({ msg: "Access denied. User is not an instructor or admin." });
    }
  } catch (error) {
    console.log("Error while checking if user is instructor:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

