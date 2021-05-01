const express = require("express")
const auth_controller = require("../controller/auth")

module.exports = express
  .Router()
  .post("/auth/register", auth_controller.register)
  .post("/auth/signin", auth_controller.signin)
  .post("/auth/token", auth_controller.token)
