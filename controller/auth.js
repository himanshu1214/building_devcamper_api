const Bootcamp = require('../models/bootcamps');
const Course = require('../models/courses');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('../middleware/async');
const User = require('../models/users');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

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


// @desc Update Login User details
// @route PUT /api/v1/auth/update
// @access Public
exports.updateDetails = AsyncHandler( async ( req, res, next ) => {
  const valuesToUpdate = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findByIdAndUpdate(req.user.id, valuesToUpdate, {
    new: true,
    runValidators: true
  }); // id is populated by protect middleware

  if (!user){
    return next( new ErrorResponse('Not valid credentials', 401) )
  }

  res.status(200).json({
    success: true,
    data: user
  });

});


// @desc Update Login User Password
// @route PUt /api/v1/auth/updatepassword
// @access Public
exports.updatePassword = AsyncHandler( async ( req, res, next ) => {

  const user = await User.findById( req.user.id ).select('+password'); // id is populated by protect middleware
  console.log(user.password)
  if (!(await user.matchPassword(req.body.current_password))){
    return next( new ErrorResponse('Not valid credentials', 401) )
  }

  user.password = req.body.new_password;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
} )

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
    user
  });
};

exports.login_users = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true, 
    data: user
  });
});



// @desc send forgot password to email
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = AsyncHandler( async (req, res, next) => {

  const user = await User.findOne( { email: req.body.email } ); // get email from body

  if (!user) {
    return next(new ErrorResponse('User doesnot exist', 404));
  }

  const user_token = user.get_reset_password(); // get user token


  const reset_url = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${user_token}`;



  const message = `You are receiving as you have requested for reset -password. Please use the before expire to reset pass ${reset_url} `

  // send mail back
  try{
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    res.status(200).json({ success: true, data: 'Email send' });
  } catch (err) {
    user.resetPasswordExpire= undefined,
    user.resetPasswordToken= undefined
    await user.save({ validateBeforeSave: false });

    return next( new ErrorResponse('Failed to send the reset token', 500) )
  }

  await user.save({ validateBeforeSave: false }); // save the new user with resetpassword_token and token expire

} );


// @desc send forgot password to email
// @route POST /api/v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = AsyncHandler( async ( req, res, next ) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  console.log(resetPasswordToken);
  const user = await User.findOne( { resetPasswordToken, 
                                resetPasswordExpire: { $gt: Date.now() } } );

  if (!user ) {
    next( new ErrorResponse( 'Password didnot match or its expired', 404 ) );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user,200,res);
})