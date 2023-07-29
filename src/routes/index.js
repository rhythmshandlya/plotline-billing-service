const express = require('express');

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const catalogRouter = require('./catalog.route');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    router: authRouter
  },
  {
    path: '/user',
    router: userRouter
  },
  {
    path: '/catalog',
    router: catalogRouter
  }
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
