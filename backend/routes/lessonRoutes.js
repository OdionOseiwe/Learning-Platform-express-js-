import express from "express";
const LessonRouter = express.Router();
import { getLessons, getLessonsOfLoggedInIntructor,getLessonById, createLesson,enrollLesson, updateLesson, completeLesson } from "../controllers/lessonController.js";
import { verifyToken, instructor } from "../middleware/authMiddleware.js";

LessonRouter.get("/", getLessons);
LessonRouter.get("/instructor", verifyToken,instructor, getLessonsOfLoggedInIntructor);
LessonRouter.get("/:id",verifyToken, getLessonById);
LessonRouter.post("/", verifyToken, instructor, createLesson);
LessonRouter.put("/:id", verifyToken, instructor, updateLesson);
LessonRouter.put("/:id/enroll", verifyToken, enrollLesson);
LessonRouter.put("/:id/complete", verifyToken, completeLesson);

export default LessonRouter;
