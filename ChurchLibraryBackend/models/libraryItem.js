'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LibraryItem extends Model {
    static associate(models) {
      LibraryItem.belongsTo(models.Category, { foreignKey: 'categoryId' });
      LibraryItem.hasMany(models.Review, { foreignKey: 'itemId' });
      LibraryItem.hasMany(models.ReadingList, { foreignKey: 'itemId' });
      LibraryItem.hasMany(models.Annotation, { foreignKey: 'itemId' });
      LibraryItem.hasMany(models.Download, { foreignKey: 'itemId' });
    }
  }
  LibraryItem.init({
    itemId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    authors: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    description: {
      type: DataTypes.TEXT
    },
    publicationDate: {
      type: DataTypes.DATE
    },
    format: {
      type: DataTypes.ENUM('Physical', 'PDF', 'EPUB', 'Audiobook', 'Video'),
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.TEXT
    },
    coverImageUrl: {
      type: DataTypes.TEXT
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'categoryId'
      }
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'LibraryItem',
  });
  return LibraryItem;
};