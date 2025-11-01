const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const message = `Duplicate field value: ${
    err.keyValue.name
  }. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error, send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  //Programming or other unknown error
  else {
    //1) Log the error
    console.log('Error😒', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    // let error = { name: err.name, message: err.message };
    // error = Object.assign(error, err);
    //in newer versions when destructuring err , error is not assigned err.name so one solution is
    //in the if condition check err.name and not error.name
    //other solution can be to explixitly define name of error to be err.name and message as err.message and then remaining
    // by doing error=Object.assign(error, err)
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
