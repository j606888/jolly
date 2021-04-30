const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../../middleware/auth")

const db = require("../../models/index")
const User = db.User

router.post("/auth/register", async (req, res) => {
  try {
    const user = User.build(req.body)
    await user.save()

    const token = jwt.sign({ id: user.id }, process.env.JWT_SALT, {
      expiresIn: "1h",
    })

    res.send({ user, token })
  } catch (e) {
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_SALT, {
      expiresIn: "1h",
    })

    res.send({ user, token })
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get("/users/me", auth, async (req, res) => {
  info = await req.user.info()
  res.send(info)
})

module.exports = router
