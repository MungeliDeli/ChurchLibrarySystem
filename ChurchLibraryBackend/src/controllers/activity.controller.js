const { ActivityLog, User } = require('../../models');
const { Op } = require('sequelize');

// Helper function to format date
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

exports.logActivity = async (req, res) => {
  try {
    const { actionType, affectedResource } = req.body;
    const userId = req.user.id; // This should be the UUID from the User model
    const ipAddress = req.ip || req.connection.remoteAddress;

    console.log('Activity Log Request:', {
      actionType,
      affectedResource,
      userId,
      userIdType: typeof userId,
      ipAddress
    });

    // Validate required fields
    if (!actionType) {
      return res.status(400).json({ message: 'actionType is required.' });
    }

    // Validate that userId exists and is valid
    if (!userId) {
      console.error('No user ID provided in request');
      return res.status(400).json({ message: 'User authentication required.' });
    }

    // Create activity log with optional affectedResource
    const activityData = {
      actorId: userId,
      actionType: actionType,
      affectedResource: affectedResource || null, // Allow null
      ipAddress: ipAddress || null,
    };

    console.log('Creating activity log with data:', activityData);

    const log = await ActivityLog.create(activityData);

    console.log('Activity logged successfully:', log.logId);

    res.status(201).json({ 
      message: 'Activity logged successfully.',
      logId: log.logId
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    
    // Provide detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        sql: error.sql,
        original: error.original
      });
    }
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    
    // Handle foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        message: 'Invalid user reference. User may not exist.',
        error: 'Foreign key constraint failed'
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Duplicate entry',
        error: 'Unique constraint failed'
      });
    }

    res.status(500).json({ 
      message: 'Error logging activity.', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get activity logs with filtering
exports.getActivityLogs = async (req, res) => {
  try {
    const { userId, actionType, startDate, endDate, page = 1, limit = 50, includeArchived = false } = req.query;
    
    const where = {};
    
    // Filter by user
    if (userId) {
      where.actorId = userId;
    }
    
    // Filter by action type
    if (actionType) {
      where.actionType = { [Op.like]: `%${actionType}%` };
    }
    
    // Filter by date range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        where.createdAt[Op.gte] = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
      }
    }
    
    // Filter archived logs
    if (!includeArchived) {
      where.isArchived = false;
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await ActivityLog.findAndCountAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    res.json({
      logs: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Error fetching activity logs.', error: error.message });
  }
};

// Export activity logs
exports.exportActivityLogs = async (req, res) => {
  try {
    const { userId, actionType, startDate, endDate, format: exportFormat = 'json' } = req.query;
    
    const where = { isArchived: false };
    
    if (userId) {
      where.actorId = userId;
    }
    
    if (actionType) {
      where.actionType = { [Op.like]: `%${actionType}%` };
    }
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }
    
    const logs = await ActivityLog.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    if (exportFormat === 'csv') {
      // Convert to CSV
      const csvHeader = 'Log ID,User Name,User Email,Action Type,Affected Resource,IP Address,Date\n';
      const csvRows = logs.map(log => {
        const user = log.User || {};
        return [
          log.logId,
          `"${user.name || 'N/A'}"`,
          `"${user.email || 'N/A'}"`,
          `"${log.actionType}"`,
          `"${(log.affectedResource || '').replace(/"/g, '""')}"`,
          log.ipAddress || 'N/A',
          formatDate(log.createdAt)
        ].join(',');
      }).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=activity-logs-${Date.now()}.csv`);
      res.send(csvHeader + csvRows);
    } else {
      // JSON format
      const jsonData = logs.map(log => ({
        logId: log.logId,
        userName: log.User?.name || 'N/A',
        userEmail: log.User?.email || 'N/A',
        userRole: log.User?.role || 'N/A',
        actionType: log.actionType,
        affectedResource: log.affectedResource,
        ipAddress: log.ipAddress,
        date: formatDate(log.createdAt)
      }));
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=activity-logs-${Date.now()}.json`);
      res.json(jsonData);
    }
  } catch (error) {
    console.error('Error exporting activity logs:', error);
    res.status(500).json({ message: 'Error exporting activity logs.', error: error.message });
  }
};

// Archive activity logs
exports.archiveActivityLogs = async (req, res) => {
  try {
    const { logIds, archiveAll = false, olderThanDays } = req.body;
    
    const where = { isArchived: false };
    
    if (!archiveAll && logIds && logIds.length > 0) {
      where.logId = { [Op.in]: logIds };
    } else if (olderThanDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(olderThanDays));
      where.createdAt = { [Op.lt]: cutoffDate };
    } else if (!archiveAll) {
      return res.status(400).json({ message: 'Either logIds, archiveAll, or olderThanDays must be provided.' });
    }
    
    const [updatedCount] = await ActivityLog.update(
      { isArchived: true },
      { where }
    );
    
    res.json({
      message: `Successfully archived ${updatedCount} activity log(s).`,
      archivedCount: updatedCount
    });
  } catch (error) {
    console.error('Error archiving activity logs:', error);
    res.status(500).json({ message: 'Error archiving activity logs.', error: error.message });
  }
};