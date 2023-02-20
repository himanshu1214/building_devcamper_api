const Bootcamp = require('../models/bootcamps');
const Course = require('../models/courses');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('../middleware/async');


// @desc Register User
// @route /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.register = AsyncHandler(async (req, res, next) => {
    console.log(req)
    res.status(200).json( {
    success: true
    } );
    });