const Bootcamp = require('../models/bootcamps');
const Course = require('../models/courses');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const AsyncHandler = require('../middleware/async');


// @desc get all Courses
// @route /api/v1/course
// @route /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = AsyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: '_id name description'
        }) // get all courses
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// @desc get one Course
// @route /api/v1/course/:id
// @access Public
exports.getCourse = AsyncHandler(async (req, res, next) => {
    // adding the bootcamp using populate for every course
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!course) { 
        next(new ErrorResponse(`No course available with the id : ${req.param.id}`, 404))
    };
    res.status(200).json({
        success: true,
        data: course
    });
});


// @desc create Course for bootcamp in a particular BootcampId
// @route /api/v1/bootcamps/:id/courses
// @access Private
exports.createCourse = AsyncHandler( async (req, res, next) => {

    // error handling
    try {
        req.body.bootcamp = req.params.bootcampId;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        console.log(bootcamp)
        if (!bootcamp) {
            return   next( new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.bootcampId}`) ); 
        };

        const course = await Course.create(req.body);  //mongoose method returns a Promise

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (err) {
        next(err);
        }
    }) ;