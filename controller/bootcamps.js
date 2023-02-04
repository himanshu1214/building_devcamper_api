
const Bootcamp = require('../models/bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const AsyncHandler = require('../middleware/async');

// @desc get all Bootcamps
// @route /api/v1/bootcamps
// @access Public
exports.getBootcamps = AsyncHandler(async (req, res, next) => {
        let query;
        query_str = JSON.stringify(req.query);
        query_str = query_str.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`);
        query_json = Bootcamp.find(JSON.parse(query_str));
        const bootcamps = await query_json;
        if (!bootcamps) {
            return   next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`)); 
        }
        res.status(200).json({ success: true, count: bootcamps.length,  data: bootcamps});
    }
);


// @desc get Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = AsyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return   next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`)); // calls the next middleware inline in server.js and based on the error handler, the response the process
    }
    res.status(200).json({ success: true, data: bootcamp});
}
    );


// @desc update Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new : true, 
            runValidators: true
        });
    
        if (!bootcamp) {
            return  next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`)); 
        }
        res.status(200).json({ success: true, data: bootcamp});
    }
        catch (err) {
            next(err);
    
        }
};


// @desc create Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = async (req, res, next) => {

    // error handling
    try {
        const bootcamp = await Bootcamp.create(req.body);  //mongoose method returns a Promise
        if (!bootcamp) {
            return   next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`)); 
        }
        res.status(201).json({
            success: true,
            data: bootcamp
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
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
        if (!bootcamp) {
            return   next(new ErrorResponse(`the bootcamp doesnot exist with the id : ${req.params.id}`)); 
        }
        res.status(200).json({ success: true, data: {}});
    }
        catch (err) {
            next(err);
    
        }
};


// add geo coder controller based on the lat, long, and distance 
// @desc get all the bootcamps for the given lat and long and distance the loc
// @route /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private

exports.getBootcampInRadius =  AsyncHandler( async (req, res, next) => {
  
        const {distance, zipcode} = req.params;
        const loc = await geocoder.geocode(zipcode);
        lat = loc[0].latitude;
        long = loc[0].longitude;

        // Get the distance in radian
        // Earth radius is 6378 km
        // angle in radians = arc-length/radius
        // const radius = distance / 3963;
        const radius = distance / 3963;

        const bootcamps = await Bootcamp.find({
            location:  { $geoWithin: { $centerSphere: [[ long, lat ], radius] } }
        });

        res.status(200).json({
            success: true, 
            count: bootcamps.length,
            data: bootcamps
        });
        
});

