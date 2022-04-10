'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.belongsTo(models.User, {foreignKey: 'owner_id'});
      Car.hasMany(models.CarAvailability, {foreignKey: 'car_id'});
    }
  }
  Car.init({
    model: DataTypes.STRING,
    color: DataTypes.STRING,
    maker: DataTypes.STRING,
    total_mileage: DataTypes.DOUBLE,
    owner_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};