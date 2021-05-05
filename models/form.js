"use strict"
const { Model } = require("sequelize")
const { v4: uuidv4 } = require("uuid")
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      this.hasMany(models.Block, {
        foreignKey: "formId",
        onDelete: "CASCADE",
        hooks: true,
      })
      this.hasMany(models.Response, {
        foreignKey: "formId",
        onDelete: "CASCADE",
        hooks: true,
      })
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
  Form.prototype.info = function () {
    const expiresAt = new Date(this.expiresAt).getTime()
    const createdAt = new Date(this.createdAt).getTime()
    const updatedAt = new Date(this.updatedAt).getTime()

    return { ...this.toJSON(), expiresAt, createdAt, updatedAt }
  }
  Form.prototype.canSubmit = async function (user) {
    if (this.expiresAt && this.expiresAt < Date.now()) {
      return false
    }
    if (this.submitOnce) {
      const submitedForm = await Form.findAndCountAll({
        where: { userId: user.id, id: this.id },
      })
      if (submitedForm > 0) {
        return false
      }
    }

    return true
  }

  Form.beforeCreate((form, options) => {
    form.uuid = uuidv4()
  })
  return Form
}
