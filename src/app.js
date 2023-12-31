const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');

const globalErrHandler = require('./controllers/error.controller');
const AppError = require('./util/AppError');
const routes = require('./routes');

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(helmet());

if (process.env.MODE == 'DEV') {
  app.use(morgan('dev'));
}

app.use(sanitize());
app.use(xss());

app.use('/v1', routes);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrHandler);

module.exports = app;
