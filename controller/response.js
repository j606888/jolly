const { User, Form, Response, BlockAnswer } = require("../models/index")

exports.list_responses = async (req, res) => {
  const responses = await Response.findAll({
    where: { userId: req.user.id },
    include: [Form, User],
  })

  const responses_info = responses.map((response) => response.formInfo())
  res.send(responses_info)
}

exports.edit_response = async (req, res) => {
  const response = await Response.findOne({
    where: { userId: req.user.id, id: req.params.responseId },
    include: Form,
  })

  if (!response) {
    return res.status(404).send({ error: "Response not found" })
  }

  const blocks = await response.Form.getBlocks()
  const blockWithValue = []
  console.log("=================")
  console.log("blocks[0]: ", blocks[0])

  for await (const block of blocks) {
    console.log("block: ", block)
    let blockAnswer = await BlockAnswer.findOne({
      where: { blockId: block.id, responseId: response.id },
    })
    blockWithValue.push({ ...block.toJSON(), blockAnswer })
  }

  res.send({ ...response.Form.toJSON(), Blocks: blockWithValue })
}

exports.update_response = async (req, res) => {
  const response = await Response.findOne({
    where: { id: req.params.responseId },
    include: BlockAnswer,
  })

  if (!response) {
    return res.status(404).send({ error: "Response not found" })
  }

  await BlockAnswer.destroy({ where: { responseId: response.id } })

  for await (const blockAnswer of req.body) {
    console.log("blockAnswer: ", blockAnswer)
    let newBlockAnswer = BlockAnswer.build({
      responseId: response.id,
      blockId: blockAnswer.blockId,
      value: blockAnswer.value,
    })
    await newBlockAnswer.save()
  }

  await response.reload()
  res.send(response)
}

exports.delete_response = async (req, res) => {
  const response = await Response.findOne({
    where: { id: req.params.responseId },
  })
  if (!response) {
    res.status(404).send({ error: "Response not found" })
  }
  await response.destroy()

  res.send({ message: "Delete success" })
}
