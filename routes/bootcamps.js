const express = require('express');

const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp } = require('../controller/bootcamps')

const router = express.Router();

router.route('/').get(getBootcamps);

router.route('/:id').get(getBootcamp).post(createBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;