const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// @route   POST api/categories
// @desc    Create a new category
// @access  Private (Admin, Librarian)
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  categoryController.createCategory
);

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private (Admin, Librarian)
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  categoryController.updateCategory
);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private (Admin, Librarian)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  categoryController.deleteCategory
);

module.exports = router;
