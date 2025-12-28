const { Annotation, LibraryItem } = require('../../models');

// @desc    Create an annotation
// @route   POST /api/annotations
// @access  Private
const createAnnotation = async (req, res) => {
  const { itemId, textLocation, highlightColor, note, isNote } = req.body;
  const userId = req.user.id; // from authenticateToken middleware

  try {
    const annotation = await Annotation.create({
      userId,
      itemId,
      textLocation,
      highlightColor,
      note,
      isNote,
    });
    res.status(201).json(annotation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating annotation', error: error.message });
  }
};

// @desc    Get annotations for a specific item
// @route   GET /api/annotations/:itemId
// @access  Private
const getAnnotationsByItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const annotations = await Annotation.findAll({
      where: {
        itemId,
        userId,
      },
      order: [['createdAt', 'ASC']],
    });
    res.status(200).json(annotations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching annotations', error: error.message });
  }
};

// @desc    Delete an annotation
// @route   DELETE /api/annotations/:annotationId
// @access  Private
const deleteAnnotation = async (req, res) => {
  const { annotationId } = req.params;
  const userId = req.user.id;

  try {
    const annotation = await Annotation.findOne({
      where: {
        annotationId: annotationId,
        userId,
      },
    });

    if (!annotation) {
      return res.status(404).json({ message: 'Annotation not found or you do not have permission to delete it.' });
    }

    await annotation.destroy();
    res.status(200).json({ message: 'Annotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting annotation', error: error.message });
  }
};

// @desc    Get all annotations for a user
// @route   GET /api/annotations
// @access  Private
const getAnnotationsByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const annotations = await Annotation.findAll({
      where: { userId },
      include: [{
        model: LibraryItem,
        attributes: ['title', 'authors', 'coverImageUrl', 'fileUrl']
      }],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(annotations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching annotations', error: error.message });
  }
};

// @desc    Update an annotation
// @route   PUT /api/annotations/:annotationId
// @access  Private
const updateAnnotation = async (req, res) => {
    const { annotationId } = req.params;
    const { note, isNote } = req.body;
    const userId = req.user.id;

    try {
        const annotation = await Annotation.findOne({
            where: {
                annotationId: annotationId,
                userId,
            },
        });

        if (!annotation) {
            return res.status(404).json({ message: 'Annotation not found or you do not have permission to edit it.' });
        }

        annotation.note = note;
        if (isNote !== undefined) {
            annotation.isNote = isNote;
        }
        await annotation.save();

        res.status(200).json(annotation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating annotation', error: error.message });
    }
};

module.exports = {
  createAnnotation,
  getAnnotationsByItem,
  deleteAnnotation,
  getAnnotationsByUser,
  updateAnnotation,
};
