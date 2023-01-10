
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
exports.createBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};


// @desc delete Bootcamp by id
// @route /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};
