"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    static associate(models) {
      this.belongsTo(models.Form, { foreignKey: "formId" })
      this.hasMany(models.BlockAnswer, { foreignKey: "blockId" })
    }
  }
  Block.init(
    {
      formId: DataTypes.NUMBER,
      title: DataTypes.STRING,
      blockType: DataTypes.STRING,
      required: DataTypes.BOOLEAN,
      options: DataTypes.ARRAY(DataTypes.TEXT),
    },
    {
      sequelize,
      modelName: "Block",
    }
  )
  return Block
}
