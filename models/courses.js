const { group } = require('console');
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

// static method to get average of the course tuitions
course_schema.statics.getAverageCost = async function (bootcampId) {
  console.log('Calculating the average cost ..'.blue);

  // method return a promise so use await
  // inside aggregate make a pipeline inside a sqaure brakets
  // $avg is for average tuition fees
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  console.log(obj);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.log(err);
  }
};

// cal avg cost after addding course

course_schema.post('save', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// cal avg cost before removing course

course_schema.pre('remove', async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', course_schema);
