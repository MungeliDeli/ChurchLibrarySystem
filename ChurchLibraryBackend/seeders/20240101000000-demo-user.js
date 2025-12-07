'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // This seeder is disabled to prevent conflicts with the new admin user seeder.
    // The new seeder '20251114000008-add-admin-user.js' should be used instead.
    return Promise.resolve();
  },

  async down(queryInterface, Sequelize) {
    return Promise.resolve();
  },
};

