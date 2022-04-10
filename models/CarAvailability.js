'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CarAvailability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CarAvailability.belongsTo(models.Car, {foreignKey: 'car_id'})
      CarAvailability.belongsTo(models.User, {foreignKey: 'owner_id'})
    }
  }
  CarAvailability.init({
    available_start_date: DataTypes.DATE,
    available_end_date: DataTypes.DATE,
    daily_pricing: DataTypes.DOUBLE,
    owner_id: DataTypes.INTEGER,
    car_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CarAvailability',
  });
  return CarAvailability;
};