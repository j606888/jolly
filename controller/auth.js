const Joi = require("joi")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../models/index")
const User = db.User

exports.register = async (req, res) => {
  const data = req.body
  const schema = Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  })

  const { error, value } = schema.validate(data)

  if (error) {
    console.log("ERROR: ", error)
    return res.status(422).send(error)
  }

  try {
    const { name, email, password } = value
    const existUser = await User.findOne({ where: { email } })
    if (existUser) {
      return res.status(400).send("Email was taken")
    }

    const user = await User.register(name, email, password)
    await user.generateRefreshToken()
    const token = user.generateToken()

    res.send({ user, token })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } })
    if (!user) {
      return res.status(404).send("User not found!")
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send("password invalid")
    }

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SALT
    )
    user.refreshToken = refreshToken

    const token = jwt.sign({ id: user.id }, process.env.JWT_SALT, {
      expiresIn: "1h",
    })

    await user.save()

    res.send({ user, token, refreshToken })
  } catch (e) {
    res.status(500).send(e)
  }
}

exports.token = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken
    const result = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SALT)
    const token = jwt.sign({ id: result.id }, process.env.JWT_SALT, {
      expiresIn: "1h",
    })
    res.send({ token })
  } catch (e) {
    res.status(500).send(e)
  }
}
