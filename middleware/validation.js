const schemas = require("../middleware/schemas")

const validation = (action, property) => {
  return (req, res, next) => {
    const schema = schemas[action]
    const { error, value } = schema.validate(req[property])
    if (error) {
      const { details } = error
      const message = details.map((i) => i.message).join(",")
      console.log("Validation Fail: ", message)
      res.status(422).send({ error: message })
    } else {
      req[property] = value
      next()
    }
  }
}

module.exports = validation
