const jwt = require('jsonwebtoken');
const AsyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/users');

exports.protect = AsyncHandler(async(req, res, next) => {
    let token;

    if (!req.headers.Authorization && req.headers.Authorization.startswith('Bearer')){
        token = req.headers.Authorization.split(' ')[1]
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