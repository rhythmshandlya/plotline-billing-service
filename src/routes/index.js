const express = require('express');

const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const catalogRouter = require('./catalog.route');
const cartRouter = require('./cart.route');
const orderRouter = require('./order.route');

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
  },
  {
    path: '/cart',
    router: cartRouter
  },
  {
    path: '/order',
    router: orderRouter
  }
];

routes.forEach((route) => {
  router.use(route.path, route.router);
});

module.exports = router;
