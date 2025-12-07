'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { // Changed to PascalCase
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Changed to UUID
        defaultValue: Sequelize.UUIDV4, // Added default value
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'librarian', 'member'),
        allowNull: false,
        defaultValue: 'member',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Create index on email for faster lookups
    await queryInterface.addIndex('Users', ['email'], { // Changed to PascalCase
      name: 'users_email_index',
      unique: true,
    });

    // Create index on role for role-based queries
    await queryInterface.addIndex('Users', ['role'], { // Changed to PascalCase
      name: 'users_role_index',
    });
  },

  async down(queryInterface, Sequelize) {
    // First, remove the indexes
    await queryInterface.removeIndex('Users', 'users_email_index');
    await queryInterface.removeIndex('Users', 'users_role_index');
    
    // Then, drop the table
    await queryInterface.dropTable('Users');
  },
};
