require('dotenv').config();

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/filter',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: '30d',
  MODE: 'DEV'
};

module.exports = config;
