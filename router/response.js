const express = require("express")
const auth = require("../middleware/auth")
const response_controller = require("../controller/response")

const schemas = require("../middleware/schemas")
const validation = require("../middleware/validation")
const { response } = require("express")

module.exports = express
  .Router()
  .get("/responses", auth, response_controller.list_responses)
  .get("/responses/:responseId/edit", auth, response_controller.edit_response)
  .put("/responses/:responseId", auth, response_controller.update_response)
  .delete("/responses/:responseId", auth, response_controller.delete_response)
