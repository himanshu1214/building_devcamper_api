const express = require('express');

const advance_results = require('../middleware/advance_results');

const course = require('../models/courses');

const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controller/courses');


// include protect middleware to protect the PUT and DELETE routes

const { protect }= require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// course is created using /bootcamps/:bootcampId/courses endpoint
// course router is used inside the bootcamp router
router.route('/').get(advance_results(course, 'bootcamp'), getCourses).post(protect, createCourse);

router.route('/:id').get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse);

module.exports = router;
