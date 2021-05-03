// Sequelize Sandbox
const { Sequelize, Model, DataTypes, Op } = require("sequelize")
const sequelize = new Sequelize(
  "postgres://postgres:24373514@localhost:5432/jolly_dev"
)

const User = sequelize.define("User", {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
})

const Form = sequelize.define("Form", {
  userId: DataTypes.INTEGER,
  uuid: DataTypes.STRING,
  expiresAt: DataTypes.DATE,
})

User.hasMany(Form, { foreignKey: "userId" })
Form.belongsTo(User, { foreignKey: "userId" })

User.hello = async function () {
  console.log("This is a Class method")
  const user = await User.findOne({})
  return user
}
// console.log("User == sequelize.models.User")
;(async () => {
  const user = await User.hello()

  console.log(JSON.stringify(user, null, 2))
})()
