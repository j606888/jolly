"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Form.init(
    {
      user_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      expires_at: DataTypes.DATE,
      collect_email: DataTypes.BOOLEAN,
      display_type: DataTypes.STRING,
      submit_once: DataTypes.BOOLEAN,
      allow_edit: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Form",
    }
  )
  return Form
}
