'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Download extends Model {
    static associate(models) {
      Download.belongsTo(models.User, { foreignKey: 'userId' });
      Download.belongsTo(models.LibraryItem, { foreignKey: 'itemId' });
    }
  }
  Download.init({
    downloadId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'LibraryItems',
        key: 'itemId'
      }
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Completed', 'Failed'),
      defaultValue: 'Pending'
    },
    deviceStoragePath: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Download',
  });
  return Download;
};