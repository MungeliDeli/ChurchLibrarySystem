const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin, Librarian)
router.get(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  userController.getAllUsers
);

// @route   GET api/users/:id
// @desc    Get a single user by ID
// @access  Private (Admin, Librarian)
router.get(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  userController.getUserById
);

// @route   POST api/users
// @desc    Create a new user
// @access  Private (Admin)
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin']),
  userController.createUser
);

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private (Admin)
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  userController.updateUser
);

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  userController.deleteUser
);

// @route   GET api/users/:id/activity
// @desc    Get user activity logs
// @access  Private (Admin, Librarian)
router.get(
  '/:id/activity',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  userController.getUserActivity
);

// @route   POST api/users/:id/reset-password
// @desc    Reset user password
// @access  Private (Admin)
router.post(
  '/:id/reset-password',
  authenticateToken,
  authorizeRole(['admin']),
  userController.resetUserPassword
);

module.exports = router;

