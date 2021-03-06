const express = require("express")
const auth = require("../middleware/auth")
const response_controller = require("../controller/response")

const schemas = require("../middleware/schemas")
const validation = require("../middleware/validation")
const { response } = require("express")

module.exports = express
  .Router()
  .get("/responses", auth, response_controller.list_responses)
  .get("/responses/:responseId/edit", validation("responseId", "params"), validation("editResponse", "params"),auth, response_controller.editResponse)
  .put("/responses/:responseId", validation("responseId", "params"), auth, response_controller.update_response)
  .delete("/responses/:responseId", validation("responseId", "params"), auth, response_controller.delete_response)
