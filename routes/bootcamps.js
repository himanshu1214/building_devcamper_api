const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius,
  uploadBootcampPhoto,
} = require('../controller/bootcamps');

// Include other resources and re-route into other routes ex: Courses
const courseRouter = require('./courses');

const router = express.Router();

const bootcamp = require('../models/bootcamps');

const advanceResults = require('../middleware/advance_results');

// include protect middleware to protect the PUT and DELETE routes

const { protect, authorize }= require('../middleware/auth');

// Rerouting to course router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampInRadius);

router.route('/')
    .get(advanceResults(bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id').get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete( protect, deleteBootcamp);

router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto);

module.exports = router;
