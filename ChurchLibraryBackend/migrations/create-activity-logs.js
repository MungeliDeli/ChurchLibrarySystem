'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ActivityLogs', {
      logId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      actorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      actionType: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      affectedResource: {
        type: Sequelize.TEXT
      },
      ipAddress: {
        type: Sequelize.STRING(45)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ActivityLogs');
  }
};