const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/multer');

// @route   POST api/books
// @desc    Create a new library item
// @access  Private (Admin, Librarian)
router.post(
  '/',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  upload.single('bookFile'),
  libraryController.createItem
);

// @route   GET api/books
// @desc    Get all library items
// @access  Public
router.get('/', libraryController.getAllItems);

// @route   GET api/books/:id
// @desc    Get a single library item by its ID
// @access  Public
router.get('/:id', libraryController.getItemById);

// @route   PUT api/books/:id
// @desc    Update a library item
// @access  Private (Admin, Librarian)
router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  upload.single('bookFile'),
  libraryController.updateItem
);

// @route   DELETE api/books/:id
// @desc    Delete a library item
// @access  Private (Admin, Librarian)
router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['admin', 'librarian']),
  libraryController.deleteItem
);

module.exports = router;