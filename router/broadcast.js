const express = require("express")
const auth = require("../middleware/auth")
const broad_cast_controller = require("../controller/broadcast")

module.exports = express
  .Router()
  .get("/broadcast/lists", broad_cast_controller.lists)
  .post("/broadcast/send", auth, broad_cast_controller.send)
