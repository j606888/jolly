const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user.basicInfo())
})

module.exports = router
