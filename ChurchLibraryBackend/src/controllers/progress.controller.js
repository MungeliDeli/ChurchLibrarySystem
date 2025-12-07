const { ReadingProgress } = require('../../models');

exports.saveProgress = async (req, res) => {
  try {
    const { itemId, progress } = req.body;
    const userId = req.user.id;

    if (itemId === undefined || progress === undefined) {
      return res.status(400).json({ message: 'itemId and progress are required.' });
    }
    
    // Validate progress is between 0 and 1
    const numericProgress = parseFloat(progress);
    if (isNaN(numericProgress) || numericProgress < 0 || numericProgress > 1) {
      return res.status(400).json({ message: 'Progress must be a number between 0 and 1.' });
    }

    // Use findOrCreate to either create a new entry or update an existing one
    const [readingProgress, created] = await ReadingProgress.findOrCreate({
      where: { userId, itemId },
      defaults: {
        progress: numericProgress,
        lastRead: new Date(),
      }
    });

    // If the record was not created, it means it was found, so we update it
    if (!created) {
      readingProgress.progress = numericProgress;
      readingProgress.lastRead = new Date();
      await readingProgress.save();
    }

    res.status(200).json({ message: 'Progress saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress.', error: error.message });
  }
};
