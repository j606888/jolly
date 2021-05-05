const jwt = require("jsonwebtoken")
const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken")
const db = require("../models/index")
const User = db.User

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "")

    const { id } = jwt.verify(token, process.env.JWT_SALT)
    const user = await User.findByPk(id)

    if (!user) {
      res.status(400).send("Auth failed!")
    }

    req.user = user
    next()
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      res.status(403).send({ error: "Token Expired" })
    } else if (e instanceof JsonWebTokenError) {
      res.status(400).send({ error: "Auth failed!" })
    } else {
      res.status(500).send(e)
    }
  }
}

module.exports = auth
