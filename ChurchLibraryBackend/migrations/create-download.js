'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Downloads', {
      downloadId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      itemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'LibraryItems',
          key: 'itemId'
        }
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Completed', 'Failed'),
        defaultValue: 'Pending'
      },
      deviceStoragePath: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Downloads');
  }
};