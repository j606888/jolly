const { response } = require("express")
const db = require("../models/index")
const Form = db.Form
const Block = db.Block
const Response = db.Response
const BlockAnswer = db.BlockAnswer

exports.create_form = async (req, res) => {
  try {
    form = Form.build({ ...req.body, userId: req.user.id })

    await form.save()

    for (const block_data of req.body.blocks) {
      const block = Block.build({ ...block_data, formId: form.id })
      await block.save()
    }

    await form.reload({ include: Block })
    res.send(form)
  } catch (e) {
    console.log("Error: ", e)
    res.status(500).send(e)
  }
}

exports.get_all_forms = async (req, res) => {
  try {
    const forms = await Form.findAll({
      where: { userId: req.user.id },
      include: Block,
    })
    res.send(forms)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

exports.get_one_form = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { userId: req.user.id, uuid: req.params.uuid },
      include: Block,
    })

    if (!form) {
      res.status(404).send("not found")
    }

    res.send(form)
  } catch (e) {
    res.status(500).send(e)
  }
}

exports.submit_form = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { uuid: req.params.uuid },
      include: Block,
    })

    if (!form) {
      res.status(404).send("Form not found")
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

    // 1. check form can submit (expired, once)
    // 2. check all required answer is submit
    // 3. check answer format is correct
    // 4. Create Response
    // 5. Create BlockAnswer
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

exports.update_form = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { userId: req.user.id, uuid: req.params.uuid },
      include: Block,
    })

    if (!form) {
      res.status(404).send("not found")
    }

    await form.update(req.body)

    if (req.body.blocks) {
      // If Block not exist, delete it
      existBlockIds = req.body.blocks
        .map((block) => block.id)
        .filter((el) => el !== undefined)
      oldBlock = await Block.findAll({ where: { formId: form.id } })
      oldBlockIds = oldBlock.map((block) => block.id)
      shouldDeleteIds = oldBlockIds.filter(
        (oldId) => !existBlockIds.includes(oldId)
      )
      await Block.destroy({ where: { id: shouldDeleteIds, formId: form.id } })

      for (const block_data of req.body.blocks) {
        // If Block has id, update it
        if (block_data.id) {
          let block = await Block.findOne({ where: { id: block_data.id } })
          await block.update(block_data)
        } else {
          // If Block has no id, create it
          let block = Block.build({ ...block_data, formId: form.id })
          await block.save()
        }
      }
    }

    await form.reload()

    res.status(200).send(form)
  } catch (e) {
    console.log("Error: ", e)
    res.status(500).send(e)
  }
}

exports.delete_form = async (req, res) => {
  // Bad SQL with hook
  try {
    const form = await Form.findOne({
      where: { userId: req.user.id, uuid: req.params.uuid },
    })
    if (!form) {
      res.status(404).send("Form not found")
    }
    await form.destroy()
    res.status(200).send("Delete success")
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}

exports.get_form_response = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { uuid: req.params.uuid },
      include: Block,
    })
    if (!form) {
      res.status(404).send("Form not found")
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
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}
