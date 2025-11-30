'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReadingProgress extends Model {
    static associate(models) {
      ReadingProgress.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      ReadingProgress.belongsTo(models.LibraryItem, {
        foreignKey: 'itemId',
        as: 'libraryItem',
      });
    }
  }

  ReadingProgress.init({
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    itemId: {
      type: DataTypes.UUID, // Corrected data type
      allowNull: false,
      references: {
        model: 'LibraryItems',
        key: 'itemId'
      }
    },
    progress: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 1
      }
    },
    lastRead: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ReadingProgress',
    tableName: 'ReadingProgresses',
  });

  return ReadingProgress;
};
