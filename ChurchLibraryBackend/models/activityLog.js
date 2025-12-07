'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      ActivityLog.belongsTo(models.User, { foreignKey: 'actorId' });
    }
  }
  ActivityLog.init({
    logId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    actorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    actionType: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    affectedResource: {
      type: DataTypes.TEXT
    },
    ipAddress: {
      type: DataTypes.STRING(45)
    }
  }, {
    sequelize,
    modelName: 'ActivityLog',
  });
  return ActivityLog;
};