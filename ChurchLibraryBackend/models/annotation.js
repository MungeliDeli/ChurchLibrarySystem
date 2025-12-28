'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Annotation extends Model {
    static associate(models) {
      Annotation.belongsTo(models.User, { foreignKey: 'userId' });
      Annotation.belongsTo(models.LibraryItem, { foreignKey: 'itemId' });
    }
  }
  Annotation.init({
    annotationId: {
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
    textLocation: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    highlightColor: {
      type: DataTypes.STRING(10)
    },
    note: {
      type: DataTypes.TEXT
    },
    isNote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Annotation',
  });
  return Annotation;
};