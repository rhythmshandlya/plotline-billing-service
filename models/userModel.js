const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name!']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please enter your email!'],
    validate: [isEmail, 'Please provide valid Email']
  },
  role: {
    type: String,
    enum: ['admin', 'mod', 'user'],
    default: 'user'
  },
  dp: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1631&q=80'
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please Enter A Password!'],
    minLength: 8,
    select: false
  }
});

//Will work pre(before) save!
userSchema.pre('save', async function fn(next) {
  if (!this.isModified()) return next();
  this.password = await bcrypt.hash(this.password, 13);
  next();
});

//An instance method, available on every instance of document
userSchema.methods.correctPassword = async function (candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};

module.exports = mongoose.model('Users', userSchema);
