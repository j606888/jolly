const { s3DownloadLink } = require("../middleware/s3")
const { Form, Block, Response, BlockAnswer } = require("../models/index")

exports.formCreate = async (req, res, next) => {
  try {
    const form = await Form.buildWithBlock(req.user.id, req.body)
    res.send(form)
  } catch(err) {
    next(err)
  }
}

exports.getAllForms = async (req, res, next) => {
  try {
    let forms = await Form.findAll({
      where: { userId: req.user.id },
      include: [Block, Response]
    })

    res.send(forms.map((form) => form.info()))
  } catch (err) {
    next(err)
  }
}

exports.getOneForm = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      where: { userId: req.user.id, uuid: req.params.uuid },
      include: [Block, Response]
    })

    if (!form) {
      res.status(404).send({ error: "Form not found" })
    }

    const url = await s3DownloadLink(form.uuid)

    res.send({ ...form.toJSON(), url })
  } catch (err) {
    res.status(500).send(e)
  }
}

exports.submitForm = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      where: { uuid: req.params.uuid },
      include: Block,
    })

    if (!form) {
      return res.status(404).send({ error: "Form not found" })
    }

    // if (!(await form.canSubmit(req.user))) {
    //   res.status(400).send("Can't be submit")
    // }

    const response = Response.build({
      userId: req.user.id,
      formId: form.id,
    })

    await response.save()

    for (const blockData of req.body) {
      let blockAnswer = BlockAnswer.build({
        responseId: response.id,
        blockId: blockData.blockId,
        value: blockData.value,
      })
      await blockAnswer.save()
    }

    await response.reload({ include: BlockAnswer })
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

exports.formUpdate = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      where: { userId: req.user.id, uuid: req.params.uuid },
      include: Block,
    })

    if (!form) {
      res.status(404).send({ error: "Form not found" })
    }

    await form.updateWithBlock(req.body)
    await form.reload({ include: Block })

    res.status(200).send(form)
  } catch (err) {
    next(err)
  }
}

exports.deleteForm = async (req, res, next) => {
  // Bad SQL with hook
  try {
    const form = await Form.findOne({
      where: { userId: req.user.id, uuid: req.params.uuid },
    })
    if (!form) {
      res.status(404).send({ error: "Form not found" })
    }
    await form.destroy()
    res.status(200).send({ message: "Delete success" })
  } catch (err) {
    next(err)
  }
}

exports.getFormResponse = async (req, res, next) => {
  try {
    const form = await Form.findOne({
      where: { uuid: req.params.uuid },
      include: Block,
    })
    if (!form) {
      res.status(404).send({ error: "Form not found" })
    }

    const result = []

    const blockIds = form.Blocks.map((block) => block.id)
    const titles = form.Blocks.map((block) => block.title)
    result.push(titles)

    const responses = await Response.findAll({
      where: { formId: form.id },
      include: BlockAnswer,
    })

    responses.forEach((response) => {
      const answerMap = {}
      response.BlockAnswers.forEach(
        (blockAnswer) =>
          (answerMap[blockAnswer.blockId] = blockAnswer.value.join(","))
      )

      const answerArray = blockIds.map((blockId) => answerMap[blockId])
      result.push(answerArray)
    })

    res.send(result)
  } catch (err) {
    next(err)
  }
}

exports.copyForm = async (req, res, next) => {
  try {
    const form = await Form.findOne({ where: { uuid: req.params.uuid } })
    if (!form) {
      res.status(404).send({ error: "Form not found" })
    }

    const newForm = await form.copyAll()
    res.send(newForm)
  } catch(err) {
    next(err)
  }
}
