const Bootcamp = require('../models/bootcamps');
const Course = require('../models/courses');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('../middleware/async');

// @desc get course for a specific bootcamp
// @route /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = AsyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc get one Course
// @route /api/v1/course/:id
// @access Public
exports.getCourse = AsyncHandler(async (req, res, next) => {
  try {
    // adding the bootcamp using populate for every course

    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description',
    });
    if (!course) {
      return next(new ErrorResponse(`No course available with the id : ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
});

// @desc create Course for bootcamp in a particular BootcampId
// @route /api/v1/bootcamps/:id/courses
// @access Private
exports.createCourse = AsyncHandler(async (req, res, next) => {
  // error handling
  try {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
      return next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.bootcampId}`));
    }

    // make sure the bootcamp owner is one creating courses
    if (bootcamp.user.toString() != req.user.id && bootcamp.user.role != 'admin'){
      return next(new ErrorResponse(` the user ${req.user.id} is not authorized to create the resource for bootcamp ${bootcamp._id}`, 401));
    }
    const course = await Course.create(req.body); //mongoose method returns a Promise

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
});

// @desc Update Course for bootcamp in a particular BootcampId
// @route /api/v1/courses/:Id
// @access Private
exports.updateCourse = AsyncHandler(async (req, res, next) => {
  // error handling
  try {
    req.body.bootcamp = req.params.bootcampId;

    let course = await Course.findById(req.params.id);
    if (!course) {
      return next(new ErrorResponse(`the course doesnot exist with the id : ${req.params.id}`));
    }

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    // make sure the bootcamp owner is one creating courses
    if (bootcamp.user.toString() != req.user.id && bootcamp.user.role != 'admin'){
      return next(new ErrorResponse(` the user ${req.user.id} is not authorized to update the resource for bootcamp ${bootcamp._id}`, 401));
    }
    course = await Course.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); //mongoose method returns a Promise

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (err) {
    next(err);
  }
});

// @desc delete Course by id
// @route /api/v1/courses/:id
// @access Private
exports.deleteCourse = AsyncHandler(async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return next(new ErrorResponse(`the course doesnot exist with the id : ${req.params.id}`));
    }
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    // make sure the bootcamp owner is one creating courses
    if (bootcamp.user.toString() != req.user.id && bootcamp.user.role != 'admin'){
      return next(new ErrorResponse(` the user ${req.user.id} is not authorized to update the resource for bootcamp ${bootcamp._id}`, 401));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
});
