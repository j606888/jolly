"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      this.hasMany(models.Block, { foreignKey: "formId" })
      this.hasMany(models.Response, { foreignKey: "formId" })
      this.belongsTo(models.User, { foreignKey: "userId" })
    }
  }
  Form.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      uuid: DataTypes.STRING,
      description: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      collectEmail: DataTypes.BOOLEAN,
      displayType: DataTypes.STRING,
      submitOnce: DataTypes.BOOLEAN,
      allowEdit: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Form",
    }
  )
  Form.beforeCreate((form, options) => {
    form.uuid = uuidv4()
  })
  return Form
}
