const express = require("express")
const auth_controller = require("../controller/auth")

const schemas = require("../middleware/schemas")
const validation = require("../middleware/validation")

module.exports = express
  .Router()
  .post(
    "/auth/register",
    validation(schemas.authRegister, "body"),
    auth_controller.register
  )
  .post("/auth/signin", auth_controller.signin)
  .post("/auth/token", auth_controller.token)
