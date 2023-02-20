const express = require('express');

const advance_results = require('../middleware/advance_results');

const course = require('../models/courses');

const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controller/courses');

const router = express.Router({ mergeParams: true });

// course is created using /bootcamps/:bootcampId/courses endpoint
// course router is used inside the bootcamp router
router.route('/').get(advance_results(course, 'bootcamp'), getCourses).post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
