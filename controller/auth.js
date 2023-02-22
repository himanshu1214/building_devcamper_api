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

  // get token by calling model methods
  // this getJWTToken has access to the class attributes through this
  const token = user.getJWTToken();

  // Compare creds

  res.status(200).json({
    success: true,
    user_data: user,
    token: token
  });
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
const token = user.getJWTToken();

res.status(200).json({
  success: true,
  token: token
});
});