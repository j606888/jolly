const express = require("express")
const authController = require("../controller/auth")
const validation = require("../middleware/validation")

module.exports = express
  .Router()
  .post("/auth/register", validation("authRegister", "body"), authController.register)
  .post("/auth/signin", validation("authSignin", "body"), authController.signin)
  .post("/auth/token", validation("authToken", "body"), authController.token)
