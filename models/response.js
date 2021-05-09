"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Response extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "userId" })
      this.belongsTo(models.Form, { foreignKey: "formId" })
      this.hasMany(models.BlockAnswer, {
        foreignKey: "responseId",
        onDelete: "cascade",
      })
    }
  }
  Response.init(
    {
      userId: DataTypes.INTEGER,
      formId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Response",
    }
  )
  Response.prototype.formInfo = function () {
    return {
      id: this.id,
      formUuid: this.Form.uuid,
      formName: this.Form.name,
      formExpiresAt: new Date(this.Form.expiresAt).getTime(),
      sponsorName: this.User.name,
    }
  }

  Response.prototype.info = function () {
    const expiresAt = new Date(this.expiresAt).getTime()
    const createdAt = new Date(this.createdAt).getTime()
    const updatedAt = new Date(this.updatedAt).getTime()

    return { ...this.toJSON(), expiresAt, createdAt, updatedAt }
  }
  return Response
}
