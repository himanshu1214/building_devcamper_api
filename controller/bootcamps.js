exports.getBootcamps = (req, res, next) => {
res.status(200).json({success: true, msg: `SHOW all bootcamps`});
};

exports.getBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW bootcamps number : ${req.params.id}` });
};

exports.updateBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};

exports.createBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};

exports.deleteBootcamp = (req, res, next) => {
res.status(200).json({ success: true, msg: `SHOW all bootcamps ${req.params.id}` });
};
