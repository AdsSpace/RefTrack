const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const User = require('../models/User');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();

  if (!users?.length) {
    return res.status(404).json({ message: 'No users found' });
  }
  return res.json(users);
});

// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, email, firstName, company } = req.body;

  if (!username || !password || !email || !firstName || !company) {
    return res.status(400).json({ messsage: 'Requeired filed is missing' });
  }

  // check for duplicate
  const existingUser = await User.findOne({ username }).lean().exec();

  if (existingUser) {
    return res
      .status(409)
      .json({ message: `username ${username} already exists` });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = {
    username,
    password: hashedPwd,
    email,
    firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    company,
  };

  const user = await User.create(userObject);
  if (user) {
    return res.status(201).json({ message: `New user ${username} created` });
  }
  return res.status(400).json({ message: 'Invalid user data received' });
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const {
    id,
    username,
    password,
    email,
    firstName,
    lastName,
    phoneNumber,
    company,
    roles,
    active,
    verified,
    created,
  } = req.body;

  if (
    !id ||
    !username ||
    !password ||
    !email ||
    !firstName ||
    !company ||
    !Array.isArray(roles) ||
    !roles.length ||
    !created ||
    typeof active !== 'boolean' ||
    typeof verified !== 'boolean'
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ messsage: 'User not found' });
  }

  const existingUser = await User.findOne({ username }).lean().exec();
  // eslint-disable-next-line no-underscore-dangle
  if (existingUser && existingUser?._id.toString() !== id) {
    return res
      .status(409)
      .json({ message: `Username ${username} already used by another user` });
  }

  user.username = username;
  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;
  user.phoneNumber = phoneNumber;
  user.company = company;
  user.roles = roles;
  user.active = active;
  user.verified = verified;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  return res.status(200).json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'User Id is required' });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  const result = await user.deleteOne();
  return res.json({
    // eslint-disable-next-line no-underscore-dangle
    message: `User ${result.username} with Id ${result._id} deleted`,
  });
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
