const db = require("../models/index")
const Form = db.Form
const Block = db.Block

exports.create_form = async (req, res) => {
  try {
    form = Form.build({ ...req.body, userId: req.user.id })

    await form.save()

    for (const block_data of req.body.blocks) {
      const block = Block.build({ ...block_data, formId: form.id })
      await block.save()
    }

    res.send("Create success")
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
