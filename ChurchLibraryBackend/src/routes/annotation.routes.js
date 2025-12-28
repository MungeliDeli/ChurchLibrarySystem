const express = require('express');
const router = express.Router();
const annotationController = require('../controllers/annotation.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

router.route('/')
  .get(authenticateToken, annotationController.getAnnotationsByUser)
  .post(authenticateToken, annotationController.createAnnotation);

// @route   GET api/annotations/:itemId
// @desc    Get all annotations for a specific item for the logged-in user
// @access  Private
router.get('/:itemId', authenticateToken, annotationController.getAnnotationsByItem);

// @route   DELETE api/annotations/:annotationId
// @desc    Delete an annotation
// @access  Private
router.route('/:annotationId')
    .delete(authenticateToken, annotationController.deleteAnnotation)
    .put(authenticateToken, annotationController.updateAnnotation);

module.exports = router;
