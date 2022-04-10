'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

  [
    queryInterface.addColumn('CarAvailabilities', 'available_end_date', Sequelize.DATE),
    queryInterface.renameColumn('CarAvailabilities', 'availale_dates', 'available_start_date')
  ]     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    [
      queryInterface.removeColumn('CarAvailabilities', 'available_end_date', Sequelize.DATE),
      queryInterface.renameColumn('CarAvailabilities', 'available_start_date', 'availale_dates')
    ]
  }
};
