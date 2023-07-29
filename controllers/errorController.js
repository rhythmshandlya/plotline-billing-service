const AppError = require('../util/AppError');

const castErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const validationErrorDB = (err) => {
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `Validation failed!  ${error.join(' | ')}`;
  return new AppError(message, 400);
};

const duplicateErrorDB = (err) => {
  const message = `Email already exists, please login`;
  return new AppError(message, 400);
};

const jsonWebTokenError = (err) =>
  new AppError('Invalid Token, please login again', 401);

const jwtExpiredError = (err) =>
  new AppError('Token has expired, please login again', 401);

//Send All error details when in development
const devError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

//Send only important error message in production and not all the details
const prodError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('Unexpected ERROR', err);
    res.status(500).json({
      status: false,
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = false;

  if (process.env.MODE === 'DEV') {
    devError(err, res);
  } else if (process.env.MODE === 'PRO') {
    let error = Object.create(err);
    if (error.name == 'CastError') error = castErrorDB(error);
    if (error.name == 'ValidationError') error = validationErrorDB(error);
    if (error.code == 11000) error = duplicateErrorDB(error);
    if (error.name == 'JsonWebTokenError') error = jsonWebTokenError(error);
    if (error.name == 'TokenExpiredError') error = jwtExpiredError(error);
    //..
    prodError(error, res);
  }
};
