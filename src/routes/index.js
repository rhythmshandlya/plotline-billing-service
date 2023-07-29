const express = require('express');

const authRouter = require('./auth.route');
const userRouter = require('./user.route');

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
