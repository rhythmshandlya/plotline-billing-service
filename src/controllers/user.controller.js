const User = require('../models/user.model');
const AppError = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');
const { filterData } = require('../util/filterData');
const useQuery = require('../util/useQuery');

exports.getAllUsers = async (req, res, next) => {
  try {
    const usersData = await useQuery(User, req.query);
    res.status(200).json({
      status: true,
      ...usersData
    });
  } catch (error) {
    next(error);
  }
};
exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('Cannot change user password from this route!'));

  if (req.body.email) return next(new AppError('Email cannot be changed!'));

  bodyFilter = filterData(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.params.id, bodyFilter, {
    new: true,
    runValidator: true
  });

  res.status(200).json({
    status: true,
    user: updatedUser
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.params._id, { active: false });
  res.status(204).json({
    status: true,
    data: null
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json({
      status: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    next(new AppError(404, 'User not found'));
  }
});
