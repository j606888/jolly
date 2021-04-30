const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")

router.get("/users/me", auth, async (req, res) => {
  info = await req.user.info()
  res.send(info)
})

module.exports = router
