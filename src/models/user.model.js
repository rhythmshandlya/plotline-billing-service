const mongoose = require('mongoose');
const { isEmail, isURL } = require('validator');
const bcrypt = require('bcrypt');
const Cart = require('./cart.model');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name!']
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId
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
    password: {
      type: String,
      required: [true, 'Please Enter A Password!'],
      minLength: 8,
      select: false
    }
  },
  {
    versionKey: false // Disable the versionKey (__v) field
  }
);

//Will work pre(before) save!
userSchema.pre('save', async function fn(next) {
  this.password = await bcrypt.hash(this.password, 13);
  next();
});

// Define a pre-save middleware to create a default cart and save its ID in the user's cart field
userSchema.pre('save', async function (next) {
  if (this.role === 'user' && !this.cart) {
    try {
      const cart = await Cart.create({ userId: this._id });
      this.cart = cart._id;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

//An instance method, available on every instance of document
userSchema.methods.correctPassword = async function (candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};

module.exports = mongoose.model('Users', userSchema);
