import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose';
import Lesson from '../models/lessonModel';
import { getVideoDurationFromBuffer } from '../utils/getVideoDurationFromBuffer';

// Get GridFS bucket
const getBucket = () => {
  const conn = mongoose.connection;
  const db = conn.db;
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'videos' });
};

// @desc    Upload video
// @route   POST /api/videos/upload
// @access  Private/Instructor
const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No video file uploaded');
  }

  try {
    // Get file details from GridFS
    const bucket = getBucket();
    const cursor = bucket.find({ _id: req.file.id });
    const files = await cursor.toArray();
    
    if (!files || files.length === 0) {
      res.status(404);
      throw new Error('File not found after upload');
    }

    const videoFile = files[0];
    
    // Get video duration (this would be a placeholder - actual implementation depends on your setup)
    // In a real implementation, you might use ffprobe or a similar tool
    const duration = 0; // Placeholder

    const videoData = {
      fileId: videoFile._id,
      filename: videoFile.filename,
      contentType: videoFile.metadata.contentType,
      uploadDate: videoFile.uploadDate,
      duration: duration
    };

    res.status(201).json({
      ...videoData,
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500);
    throw new Error(`Video upload failed: ${error.message}`);
  }
});

// @desc    Stream video
// @route   GET /api/videos/:id/stream
// @access  Private
const streamVideo = asyncHandler(async (req, res) => {
  try {
    const bucket = getBucket();
    
    // Check if file exists
    const cursor = bucket.find({ _id: new mongoose.Types.ObjectId(req.params.id) });
    const files = await cursor.toArray();
    
    if (!files || files.length === 0) {
      res.status(404);
      throw new Error('Video not found');
    }
    
    const videoFile = files[0];
    
    // Set proper content type
    res.set('Content-Type', videoFile.metadata.contentType);
    
    // Handle range requests for video streaming
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoFile.length - 1;
      const chunkSize = (end - start) + 1;
      
      res.set({
        'Content-Range': `bytes ${start}-${end}/${videoFile.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
      });
      
      res.status(206); // Partial Content
      
      const downloadStream = bucket.openDownloadStream(videoFile._id, {
        start,
        end: end + 1
      });
      
      downloadStream.pipe(res);
    } else {
      res.set('Content-Length', videoFile.length);
      const downloadStream = bucket.openDownloadStream(videoFile._id);
      downloadStream.pipe(res);
    }
  } catch (error) {
    console.error('Video streaming error:', error);
    res.status(500);
    throw new Error(`Video streaming failed: ${error.message}`);
  }
});

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private/Instructor
const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const bucket = getBucket();
    
    // Delete file from GridFS
    await bucket.delete(new mongoose.Types.ObjectId(req.params.id));
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Video deletion error:', error);
    res.status(500);
    throw new Error(`Video deletion failed: ${error.message}`);
  }
});

module.exports = { uploadVideo, streamVideo, deleteVideo };
