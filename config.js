const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/filter',
  REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: '30d',
  MODE: 'DEV',
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_ID,
  CLIENT_URL: 'http://localhost:3000/'
};
