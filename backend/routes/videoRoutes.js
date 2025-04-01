import express from "express";
const router = express.Router();
import { protect, instructor } from "../middleware/authMiddleware";
const { uploadVideo, streamVideo, deleteVideo } = require('../controllers/videoController');
import {
  uploadVideo,
  streamVideo,
  deleteVideo,
} from "../controllers/videoController";
import upload from "../config/gridfsStorage";

router.post('/upload', protect, instructor, upload.single('video'), uploadVideo);
router.get('/:id/stream', streamVideo);
router.delete('/:id', protect, instructor, deleteVideo);

module.exports = router;
