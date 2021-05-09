"use strict"
const { Model } = require("sequelize")
const { s3UploadLink } = require('../middleware/s3')
const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      this.hasMany(models.Block, {
        foreignKey: "formId",
        onDelete: "CASCADE",
        hooks: true,
      })
      this.hasMany(models.Response, {
        foreignKey: "formId",
        onDelete: "CASCADE",
        hooks: true,
      })
      this.belongsTo(models.User, { foreignKey: "userId" })
    }

    static async buildWithBlock(userId, body) {
      const { Block } = require("../models/index")
      const form = Form.build({ ...body, userId })
      await form.save()
  
      for (let block of body.blocks) {
        await Block.create({ ...block, formId: form.id })
      }
  
      await form.reload({ include: Block })
      const url = await s3UploadLink(form.uuid)

      return { ...form.info(), url }
    }

    async updateWithBlock(body) {
      const { Block } = require("../models/index")
      await this.update(body)

      if (body.blocks) {
        const existBlockIds = body.blocks.map((block) => block.id).filter((el) => el !== undefined)
        const oldBlock = await Block.findAll({ where: { formId: this.id } })
        const oldBlockIds = oldBlock.map((block) => block.id)
        const shouldDeleteIds = oldBlockIds.filter((oldId) => !existBlockIds.includes(oldId))
        await Block.destroy({ where: { id: shouldDeleteIds, formId: this.id } })

        for (const block_data of body.blocks) {
          if (block_data.id) {
            let block = await Block.findOne({ where: { id: block_data.id, formId: this.id } })
            if (!block) {
              throw new Error(`blockId ${block_data.id} not found`)
            }
            await block.update(block_data)
          } else {
            let block = Block.build({ ...block_data, formId: this.id })
            await block.save()
          }
        }
      }
    }

    info() {
      const expiresAt = new Date(this.expiresAt).getTime()
      const createdAt = new Date(this.createdAt).getTime()
      const updatedAt = new Date(this.updatedAt).getTime()
  
      return { ...this.toJSON(), expiresAt, createdAt, updatedAt }
    }

    async copyAll() {
      const formData = this.toJSON()
      formData.name = `${formData.name} - copy`
      delete formData.id
      delete formData.createdAt
      delete formData.updatedAt

      const form = await Form.create(formData)
      const blocks = await this.getBlocks()

      for await (const block of blocks) {
        let blockData = block.toJSON()

        delete blockData.id
        delete blockData.createdAt
        delete blockData.updatedAt
        blockData.formId = form.id

        const { Block } = require("../models/index")
        await Block.create(blockData)
      }

      return form
    }

    async canSubmit(user) {
      if (this.expiresAt && this.expiresAt < Date.now()) {
        return false
      }
      if (this.submitOnce) {
        const submitedForm = await Form.findAndCountAll({
          where: { userId: user.id, id: this.id },
        })
        if (submitedForm > 0) {
          return false
        }
      }
  
      return true
    }
  }

  Form.init(
    {
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      uuid: DataTypes.STRING,
      description: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      collectEmail: DataTypes.BOOLEAN,
      displayType: DataTypes.STRING,
      submitOnce: DataTypes.BOOLEAN,
      allowEdit: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Form",
    }
  )

  Form.beforeCreate((form, options) => {
    form.uuid = uuidv4()
  })

  return Form
}
