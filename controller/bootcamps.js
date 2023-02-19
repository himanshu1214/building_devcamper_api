const Bootcamp = require('../models/bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const AsyncHandler = require('../middleware/async');
const { param } = require('../routes/courses');
const path = require('path');

// @desc get all Bootcamps
// @route /api/v1/bootcamps
// @access Public
exports.getBootcamps = AsyncHandler(async (req, res, next) => {
  let query_json;

  //Copy the query using a spread operator
  const req_query = { ...req.query };

  //Fields to remove
  const remove_field = ['select', 'sort', 'page'];

  //Loop over and delete the param
  // ex: const filterByLength = (arr, len) => arr.filter(s => s.length <= len);
  remove_field.forEach((param) => delete req_query[param]);

  query_str = JSON.stringify(req_query);
  query_str = query_str.replace(/\b(lt|lte|gt|gte|in)\b/g, (match) => `$${match}`);
  query_json = Bootcamp.find(JSON.parse(query_str)).populate('courses');

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query_json = query_json.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sort_by = req.query.sort.split(',').join(' ');
    query_json = query_json.sort(sort_by);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const start_index = (page - 1) * limit;
  const end_index = page * limit;
  const total = await Bootcamp.countDocuments();

  query_json = query_json.skip(start_index).limit(limit);

  const bootcamps = await query_json;
  pagination = {};

  if (end_index < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (start_index > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (!bootcamps) {
    return next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`));
  }
  res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

// @desc get Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = AsyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`)); // calls the next middleware inline in server.js and based on the error handler, the response the process
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc update Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`));
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

// @desc create Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = async (req, res, next) => {
  // error handling
  try {
    const bootcamp = await Bootcamp.create(req.body); //mongoose method returns a Promise
    if (!bootcamp) {
      return next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`));
    }
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
};

// @desc delete Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    bootcamp.remove();

    if (!bootcamp) {
      return next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`));
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// add geo coder controller based on the lat, long, and distance
// @desc get all the bootcamps for the given lat and long and distance the loc
// @route /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampInRadius = AsyncHandler(async (req, res, next) => {
  const { distance, zipcode } = req.params;
  const loc = await geocoder.geocode(zipcode);
  lat = loc[0].latitude;
  long = loc[0].longitude;

  // Get the distance in radian
  // Earth radius is 6378 km
  // angle in radians = arc-length/radius
  // const radius = distance / 3963;
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
  
});

// @desc delete Bootcamp by id
// @route /api/v1/bootcamp/:id/photo
// @access Private


exports.uploadBootcampPhoto = AsyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.findById(req.params.id);
  if (!bootcamps){
    return next(
      new ErrorResponse(`Bootcamp not found with ${req.params.id}`, 404)
    );
  }

  if (!req.files){
    return next(new ErrorResponse(
      `Please upload an image`, 404
    ));
  }

  const file = req.files.file;


  if (!file.mimetype.startsWith('image')){
    console.log(file.mimetype)
    return next(new ErrorResponse(`The file uploaded format is ${file.mimetype} is not acceptable`, 400))
  };

  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE){
    return next(new ErrorResponse(` File Size ${file.size} is more than acceptable ${process.env.vMAX_UPLOAD_FILE_SIZE}`, 400 ))
  };

  file.name = `photo._${bootcamps._id}${path.parse(file.name).ext}`;

  file.mv( `${process.env.UPLOAD_FILE_FOLDER}/${file.name}`, async err => {
    if (err) {
      return next( new ErrorResponse( 'File upload failed please check file folder and file', 400 ) );
    };

    await Bootcamp.findByIdAndUpdate( req.param.id, { photo: file.name } );
    res.status(200).json({
      success: true, 
      data: file.name
    });
  });

});

