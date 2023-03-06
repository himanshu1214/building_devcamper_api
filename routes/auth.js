const express = require('express');

const { register,login, login_users, forgotPassword, resetPassword, updateDetails, updatePassword } = require('../controller/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/register').post( register );
router.route('/login').post( login );
router.route('/me').get( protect, login_users );
router.route('/userdetails').put( protect, updateDetails );
router.route('/updatepassword').put( protect, updatePassword );
router.route('/forgotpassword').post( forgotPassword );
router.route('/resetpassword/:resettoken').put( resetPassword );


module.exports = router;
