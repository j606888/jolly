const jwt = require("jsonwebtoken")
const db = require("../models/index")
const User = db.User

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "")

    const { id } = jwt.decode(token, process.env.JWT_SALT)
    const user = await User.findByPk(id)
    req.user = user
  } catch (e) {
    console.log("Auth Failed")
  }
  next()
}

module.exports = auth
