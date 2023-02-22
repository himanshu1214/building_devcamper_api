const Bootcamp = require('../models/bootcamps');
const Course = require('../models/courses');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('../middleware/async');
const User = require('../models/users');

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public

exports.register = AsyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create User in Database for Table User
    const user  = await User.create(
        {
            name, 
            email, 
            password, 
            role
        }
    );

  sendToken(user, 200,res);
});


// @desc Login User
// @route POST /api/v1/auth/login
// @access Public

exports.login = AsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

// Compare creds
if (!password || !email){
  return next(new ErrorResponse('Please provide the credentials', 400));
}

//Check if user exist
const user = await User.findOne({ email }).select('+password');

if (!user){
  return next(new ErrorResponse('Invalid Credentials', 401));  
}

// Check if password matches
if (!user.matchPassword(password)){
  return next(new ErrorResponse('Invalid Credentials', 401));  
}
sendToken(user, 200, res);
});


const sendToken = (user, statusCode, res) => {
  // get token by calling model methods
  // this getJWTToken has access to the class attributes through this
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now()  + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV=='production'){
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true, 
    token
  });
};