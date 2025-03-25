const express = require('express');
const router = express.Router();
const { 
  getCourses, 
  getCourseById, 
  createCourse, 
  enrollCourse 
} = require('../controllers/lessonController');
const { 
  createLesson 
} = require('../controllers/lessonController');
const { 
  createQuiz 
} = require('../controllers/quizController');
const { 
  protect, 
  instructor 
} = require('../middleware/authMiddleware');

router.route('/')
  .get(getCourses)
  .post(protect, instructor, createCourse);

router.route('/:id')
  .get(getCourseById);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

router.route('/:courseId/lessons')
  .post(protect, instructor, createLesson);

router.route('/:courseId/quizzes')
  .post(protect, instructor, createQuiz);

module.exports = router;
