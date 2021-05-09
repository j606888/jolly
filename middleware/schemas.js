const Joi = require("joi")

module.exports = {
  authRegister: Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required(),
  }),
  authSignin: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required(),
  }),
  authToken: Joi.object().keys({
    refreshToken: Joi.string().trim(),
  }),
  formCreate: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    expiresAt: Joi.number(),
    collectEmail: Joi.boolean(),
    displayType: Joi.string(),
    submitOnce: Joi.boolean(),
    allowEdit: Joi.boolean(),
    blocks: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        blockType: Joi.string().required(),
        required: Joi.boolean(),
        options: Joi.array().items(Joi.string()),
      })
    ),
  }),
  formUpdate: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    expiresAt: Joi.number(),
    collectEmail: Joi.boolean(),
    displayType: Joi.string(),
    submitOnce: Joi.boolean(),
    allowEdit: Joi.boolean(),
    blocks: Joi.array().items(
      Joi.object({
        id: Joi.number(),
        title: Joi.string().required(),
        blockType: Joi.string().required(),
        required: Joi.boolean(),
        options: Joi.array().items(Joi.string()),
      })
    ),
  }),
  editResponse: Joi.object().keys({
    responseId: Joi.number().required()
  }),
}
