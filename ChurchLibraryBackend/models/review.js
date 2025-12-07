'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.LibraryItem, { foreignKey: 'itemId' });
    }
  }
  Review.init({
    reviewId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};