const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pleasea add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },

  role: {
    type: String,
    enum: ['user', 'publisher', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please add a Password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Add Sign JWT
// statics are implemented on the model and methods are implements on Object in here it is user 
UserSchema.methods.getJWTToken = function(){
  return jwt.sign({ id: this._id}, process.env.JWT_SECRET,  {expiresIn: process.env.JWT_EXPIRE_TIME})
};

UserSchema.methods.matchPassword = async function (getPassword){
  return await bcrypt.compare(getPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);