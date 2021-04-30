"use strict"
const { Model } = require("sequelize")
var bcrypt = require("bcryptjs")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    info() {
      return {
        id: this.id,
        name: this.name,
        email: this.email,
      }
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  )

  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, process.env.PASSWORD_SALT)
  })
  return User
}
