"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class BlockAnswer extends Model {
    static associate(models) {
      this.belongsTo(models.Response, { foreignKey: "responseId" })
      this.belongsTo(models.Block, { foreignKey: "blockId" })
    }
  }
  BlockAnswer.init(
    {
      responseId: DataTypes.INTEGER,
      blockId: DataTypes.INTEGER,
      value: DataTypes.ARRAY(DataTypes.TEXT),
    },
    {
      sequelize,
      modelName: "BlockAnswer",
    }
  )
  return BlockAnswer
}
