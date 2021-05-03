const Joi = require("joi")

module.exports = {
  authRegister: Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  }),
}
