import Lesson from '../models/lessonModel.js';
import User from '../models/userModel.js';
import { Lesson } from '../Models/lessonModel';
const { body, validationResult } = require('express-validator');


//get lessons with pagination and filter
export const getLessons = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const filter = req.query.filter;

    // Build query object
    const query = { isPublished: true };
    if (filter) {
      query.category = filter;
    }

    // Get total count for pagination
    const total = await Lesson.countDocuments(query);

    // Fetch paginated results with single query
    const lessons = await Lesson.find(query)
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      lessons,
      page,
      pages: Math.ceil(total / pageSize),
      totalLessons: total
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ 
      message: 'Error fetching lessons',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getLessonById = async (req, res) => {
  // Get all lessons created by the logged-in instructor
  try {
    const lesson = await Lesson.findById(req.params.id);
    res.status(200).json({
      success: true,
      count: lesson.length,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create a lesson
// @route   POST /api/lessons
// @access  Private/Instructor
export const createLesson = async (req, res) => {
  try {
    const requiredFields = ['title', 'description', 'category', 'content'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const { 
      title, 
      description, 
      thumbnail = '', // Default empty string
      category, 
      content, 
      videoUrl = '', 
      duration = 0, 
      resources = [], // Default empty array
      quiz = null    // Default null
    } = req.body;

    const lesson = new Lesson({
      title,
      description,
      instructor: req.user._id, // From auth middleware
      thumbnail,
      category,
      content,
      videoUrl,
      duration: Math.max(0, Number(duration)), // Ensure positive number
      resources,
      quiz,
      isPublished: false // Default unpublished
    });

    await lesson.save();
    
    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });

  } catch (error) {
    console.error('Lesson creation error:', error);

    res.status(500).json({ 
      success: false,
      message: 'Server error creating lesson',
      error: error
    });
  }
};

// @desc    Update a lesson
// @route   PUT /api/lessons/:id
// @access  Private/Instructor
export const updateLesson = async (req, res) => {
  const {
    title,
    description,
    thumbnail,
    category,
    content,
    videoUrl,
    duration,
    resources,
    quiz,
  } = req.body;

try {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return res.status(404).json({ 
      success: false,
      message: 'Lesson not found' 
    });
  }

  // Check if user is the instructor of this lesson
  if (lesson.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Not authorized to edit this lesson' 
    });
  }
  lesson.title = title || lesson.title;
  lesson.description = description || lesson.description;
  lesson.thumbnail = thumbnail || lesson.thumbnail;
  lesson.category = category || lesson.category;
  lesson.content = content || lesson.content;
  lesson.videoUrl = videoUrl || lesson.videoUrl;
  lesson.duration = duration || lesson.duration;
  lesson.resources = resources || lesson.resources;
  lesson.quiz = quiz || lesson.quiz;

  const updatedLesson = await lesson.save();
  res.json(updatedLesson);
} catch (error) {
  console.error('Error updating lesson:', error);
  res.status(500).json({ 
    success: false,
    message: 'Error updating lesson',
  });
  
}
};

// @desc    Enroll in a lesson
// @route   POST /api/lessons/:id/enroll
// @access  Private
export const enrollLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  try {
    if (!lesson) {
      return res.status(404).json({ 
        success: false,
        message: 'Lesson not found' 
      }); 
    }
  
    // Check if user is already enrolled
    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledLessons.find(
      (l) => l.lessonId.toString() === lesson._id.toString()
    );
  
    if (alreadyEnrolled) {
      if (!lesson) {
        return res.status(404).json({ 
          success: false,
          message: 'Already enrolled in this lesson' 
        }); 
      }
    }
  
    // Add lesson to user's enrolled lessons
    user.enrolledLessons.push({
      lessonId: lesson._id,
      completed: false,
    });
  
    // Add user to lesson's enrolled students
    lesson.enrolledStudents.push(req.user._id);
  
    await user.save();
    await lesson.save();
  
    res.status(201).json({ message: 'Successfully enrolled in lesson' });
  } catch (error) {
    console.error('Error enrolling in lesson:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error enrolling in lesson',
  });
    
  }
  
};

export const completeLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  try {
    if (!lesson) {
      return res.status(404).json({ 
        success: false,
        message: 'Lesson not found' 
      }); 
    }
    // Check if user is enrolled in the lesson
    const user = await User.findById(req.user._id);
    const enrolledLesson = user.enrolledLessons.find(
      (l) => l.lessonId.toString() === lesson._id.toString()
    );
  
    if (!enrolledLesson) {
      return res.status(404).json({ 
        success: false,
        message: 'Not enrolled in this lesson' 
      }); 
    }
  
    // Mark lesson as completed
    enrolledLesson.completed = true;
    await user.save();
    res.status(200).json({ message: 'Lesson completed' });
    
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error completing lesson',
    });
    
  }
};

