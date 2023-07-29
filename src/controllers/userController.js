const User = require('../models/userModel');
const AppError = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');
const { filterData } = require('../util/filterData');

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find(req.query);
  res.status(200).json({
    status: true,
    length: users.length,
    users
  });
};

exports.update = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('Cannot change user password from this route!'));
  if (req.body.email) return next(new AppError('Email cannot be changed!'));

  bodyFilter = filterData(
    req.body,
    'name',
    'description',
    'niche',
    'job',
    'upvotedBlogs',
    'dp',
    'cover'
  );
  const updatedUser = await User.findByIdAndUpdate(req.user._id, bodyFilter, {
    new: true,
    runValidator: true
  });
  res.status(200).json({
    status: true,
    user: updatedUser
  });
});

exports.delete = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
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
        description: user.description,
        dp: user.dp,
        cover: user.cover,
        job: user.job,
        upvotedBlogs: user.upvotedBlogs,
        downvotedBlogs: user.downvotedBlogs
      }
    });
  } else {
    next(new AppError(404, 'User not found'));
  }
});

exports.getCurrentBlog = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('currentBlog');
  res.status(200).json({
    status: true,
    blog: user.currentBlog
  });
});
exports.pushBlog = catchAsync(async (req, res, next) => {
  UserId = req.params.UID;
  BlogId = req.params.BID;
  const bp = await User.findByIdAndUpdate(UserId, {
    $push: { upvotedBlogs: BlogId }
  });
  res.send(bp);
});
exports.pullBlog = catchAsync(async (req, res, next) => {
  UserId = req.params.UID;
  BlogId = req.params.BID;
  const bp = await User.findByIdAndUpdate(
    UserId,
    {
      $pull: { upvotedBlogs: BlogId }
    },
    {
      // multi: true
    }
  );
  res.send(bp);
});
exports.updateCurrentBlog = catchAsync(async (req, res, next) => {
  const { currentBlog } = await User.findByIdAndUpdate(
    req.user._id,
    {
      currentBlog: req.body
    },
    { new: true }
  ).select('currentBlog');

  res.status(200).json({
    status: true,
    blog: currentBlog
  });
});
