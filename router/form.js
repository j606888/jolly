const express = require("express")
const auth = require("../middleware/auth")
const form_controller = require("../controller/form")

module.exports = express
  .Router()
  .post("/forms", auth, form_controller.create_form)
  .get("/forms", auth, form_controller.get_all_forms)
  .get("/forms/:uuid", auth, form_controller.get_one_form)
