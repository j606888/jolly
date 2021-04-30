"use strict"
const { Model } = require("sequelize")
var bcrypt = require("bcryptjs")
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Response, { foreignKey: "userId" })
      this.hasMany(models.Form, { foreignKey: "userId" })
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
      refreshToken: DataTypes.STRING,
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
