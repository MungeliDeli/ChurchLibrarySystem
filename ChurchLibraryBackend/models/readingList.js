'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReadingList extends Model {
    static associate(models) {
      ReadingList.belongsTo(models.User, { foreignKey: 'userId' });
      ReadingList.belongsTo(models.LibraryItem, { foreignKey: 'itemId' });
    }
  }
  ReadingList.init({
    listId: {
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
      type: DataTypes.ENUM('Planned', 'Reading', 'Completed'),
      defaultValue: 'Planned'
    },
    reminderSet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    scheduleDate: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'ReadingList',
  });
  return ReadingList;
};