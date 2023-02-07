const express = require('express');

const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controller/courses');

const router = express.Router({ mergeParams: true });

// course is created using /bootcamps/:bootcampId/courses endpoint
// course router is used inside the bootcamp router
router.route('/').get(getCourses).post(createCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
