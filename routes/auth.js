const express = require('express');

const { register,login, login_users } = require('../controller/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, login_users);

module.exports = router;
