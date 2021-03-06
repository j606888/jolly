"use strict"
const { Model } = require("sequelize")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Response, { foreignKey: "userId" })
      this.hasMany(models.Form, { foreignKey: "userId" })
    }
    async info() {
      const token = await this.generateToken()
      return {
        id: this.id,
        name: this.name,
        email: this.email,
        refreshToken: this.refreshToken,
        token: token,
      }
    }

    basicInfo() {
      const { id, name, email } = this
      return {
        id,
        name,
        email,
      }
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.password)
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

  User.register = async function (name, email, password) {
    const encryptedPassword = bcrypt.hashSync(
      password,
      process.env.PASSWORD_SALT
    )
    const user = User.build({ name, email, password: encryptedPassword })
    await user.save()
    await user.generateRefreshToken()
    return user
  }

  User.prototype.generateRefreshToken = async function () {
    this.refreshToken = jwt.sign(
      { id: this.id },
      process.env.REFRESH_TOKEN_SALT
    )
    await this.save()
  }

  User.prototype.generateToken = function () {
    const token = jwt.sign({ id: this.id }, process.env.JWT_SALT, {
      expiresIn: "1w",
    })
    return token
  }

  return User
}
