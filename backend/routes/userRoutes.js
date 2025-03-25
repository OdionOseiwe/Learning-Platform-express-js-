import express from 'express';
import { signup, verifyEmail, login, logout, getUserProfile,checkAuth,getInstructorDashboard } from '../controllers/userController.js';
import { verifyToken, instructor } from "../middleware/authMiddleware.js";
const UserRouter = express.Router();

UserRouter.post("/signup", signup);
UserRouter.post("/verify-email", verifyEmail);
UserRouter.post("/login", login);
UserRouter.post("/logout",logout);
UserRouter.get("/getUserProfile",verifyToken,getUserProfile);
UserRouter.get("/checkAuth",verifyToken,checkAuth);
UserRouter.get("/getIntructorProfile",verifyToken,instructor,getInstructorDashboard);

export default UserRouter;
