'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReadingProgresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      itemId: {
        type: Sequelize.UUID, // Corrected data type
        allowNull: false,
        references: {
          model: 'LibraryItems',
          key: 'itemId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      progress: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      lastRead: {
        type: Sequelize.DATE,
        allowNull: false
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

    // Add a unique constraint to prevent duplicate entries
    await queryInterface.addConstraint('ReadingProgresses', {
      fields: ['userId', 'itemId'],
      type: 'unique',
      name: 'unique_user_item_progress'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReadingProgresses');
  }
};
