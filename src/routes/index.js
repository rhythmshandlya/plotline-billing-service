const express = require('express');

const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    router: authRouter
  },
  {
    path: '/user',
    router: userRouter
  }
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
