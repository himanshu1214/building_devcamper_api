const jwt = require('jsonwebtoken');
const AsyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/users');

exports.protect = AsyncHandler(async(req, res, next) => {
    let token;
    console.log(req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    // check if token exist

    if (!token){
        return next(new ErrorResponse('Token doesnot exist'), 401);
    }


    // Verify

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // decoded object will have id key which will be set as request user
        next();
    } catch (err){
        return next(new ErrorResponse('Token doesnot exist'), 401);
    }
})