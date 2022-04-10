'use strict';
const faker = require('faker');
var moment = require('moment');

const users = [...Array(10)].map(
  (user) => ({
    name: faker.name.findName(),
    age: faker.random.number({ min: 18, max: 80 }),
    createdAt: new Date(),
    updatedAt: new Date()
  })
);

const cars = [...Array(20)].map(
  (car) => ({
    model: faker.vehicle.model(),
    color: faker.commerce.color(),
    maker: faker.vehicle.manufacturer(),
    total_mileage: faker.random.number({ min: 10, max: 10000 }),
    owner_id: faker.random.number({ min: 0, max: 9 }),
    createdAt: new Date(),
    updatedAt: new Date()
  })
);


const carSlots = [...Array(40)].map(
  (slot) => {
    var start_date = moment('10/04/2022', 'DD/MM/YYYY').subtract(faker.random.number({ min: 1, max: 10 }), 'days');
    var end_date = moment('15/04/2022', 'DD/MM/YYYY').add(faker.random.number({ min: 1, max: 20 }), 'days');
    var car_index = faker.random.number({ min: 0, max: 19 });

    return {
      available_start_date: start_date.toDate(),
      available_end_date: end_date.toDate(),
      daily_pricing: faker.random.number({ min: 100, max: 1500 }),
      owner_id: cars[car_index].owner_id,
      car_id: car_index,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
);



module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Users', users, {});
    await queryInterface.bulkInsert('Cars', cars, {});
    await queryInterface.bulkInsert('CarAvailabilities', carSlots, {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
