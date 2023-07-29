class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.status = false;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
