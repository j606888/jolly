'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Block.init({
    form_id: DataTypes.NUMBER,
    title: DataTypes.STRING,
    block_type: DataTypes.STRING,
    required: DataTypes.BOOLEAN,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Block',
  });
  return Block;
};