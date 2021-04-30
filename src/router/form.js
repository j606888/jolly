const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")

const db = require("../../models/index")
const Form = db.Form

router.post("/forms", auth, async (req, res) => {
  try {
    form = Form.build({ ...req.body, user_id: req.user.id })

    await form.save()

    res.send("Create success")
  } catch (e) {
    console.log("Error: ", e)
    res.status(500).send(e)
  }
})

router.get("/forms", auth, async (req, res) => {
  try {
    forms = await Form.findAll({ where: { user_id: req.user.id } })
    res.send(forms)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router
