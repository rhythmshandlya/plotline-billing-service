const User = require('../models/userModel');
const { promisify } = require('util');
const { catchAsync } = require('../util/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../util/AppError');
const getJwt = require('../util/getJwt');

exports.signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.email || !body.password) {
    next(new AppError('Please provide name, email and password', 400));
  }

  const newUser = await User.create({
    name: body.name,
    email: body.email,
    password: body.password
  });
  const token = getJwt(
    newUser._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRY
  );

  res.status(201).json({
    status: true,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      dp: newUser.dp
    },
    token
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password)
    return next(new AppError('please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('User Not Found!', 401));

  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email Or Password!', 401));
  }

  const token = getJwt(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRY
  );

  res.status(200).json({
    status: true,
    token,
    user
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization.split(' ')[1];
  const payLoad = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(payLoad.id).select('+isVerified');
  if (!user) return next(new AppError('User not found', 401));
  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have access to this route', 403));
    }
    next();
  };
