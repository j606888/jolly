const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const jwt = require("jsonwebtoken")

const db = require("../../models/index")
const User = db.User

router.post("/auth/register", async (req, res) => {
  try {
    const user = User.build(req.body)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SALT
    )
    user.refreshToken = refreshToken
    await user.save()

    const token = jwt.sign({ id: user.id }, process.env.JWT_SALT, {
      expiresIn: "1h",
    })

    res.send({ user, token, refreshToken })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

router.post("/auth/signin", async (req, res) => {
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
      expiresIn: "15s",
    })

    await user.save()

    res.send({ user, token, refreshToken })
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post("/auth/token", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken
    const result = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SALT)
    const token = jwt.sign({ id: result.id }, process.env.JWT_SALT, {
      expiresIn: "15s",
    })
    res.send({ token })
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
