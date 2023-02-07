const mongoose = require('mongoose');

const course_schema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course'],
  },

  description: {
    type: String,
    required: [true, 'Please add description'],
  },

  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },

  tuition: {
    type: String,
    required: [true, 'Please add tuition cost'],
  },

  minimum_skill: {
    type: String,
    required: [true, 'Please add minimum skill'],
    enum: ['beginner', 'intermediate', 'Master'],
  },
  scholarships_available: {
    type: String,
    required: [true, 'Please add scholarship availability'],
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

module.exports = mongoose.model('Course', course_schema);
