
const Bootcamp = require('../models/bootcamps');

// @desc get all Bootcamps
// @route /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
res.status(200).json({success: true, msg: `SHOW all bootcamps`});
};


// @desc get Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW bootcamps number : ${req.params.id}` });
};


// @desc update Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};


// @desc create Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.createBootcamp = async (req, res, next) => {

    // error handling
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
            res.status(400).json({success: false});
        }
    };


// @desc delete Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};
