const { ActivityLog } = require('../../models');

exports.logActivity = async (req, res) => {
  try {
    const { actionType, affectedResource } = req.body;
    const userId = req.user.id;

    if (!actionType || !affectedResource) {
      return res.status(400).json({ message: 'actionType and affectedResource are required.' });
    }

    await ActivityLog.create({
      actorId: userId,
      actionType,
      affectedResource,
      timestamp: new Date(),
    });

    res.status(201).json({ message: 'Activity logged successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging activity.', error: error.message });
  }
};
