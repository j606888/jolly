const { Form } = require("../models/index")
const broadcast = require("../services/mattermost")

exports.lists = async (req, res) => {
  const avaliableLists = [
    {
      id: 1,
      name: "Town Square",
    },
    {
      id: 2,
      name: "台南辦公室",
    },
    {
      id: 3,
      name: "customer-support",
    },
    {
      id: 4,
      name: "[Kdan] 設計部",
    },
  ]

  res.send(avaliableLists)
}

exports.send = async (req, res) => {
  const { uuid, listId } = req.body
  const form = await Form.findOne({ where: { uuid } })

  console.log("Form: ", form)
  if (!form) {
    return res.status(404).send({ error: "Form not found" })
  }

  if (![1, 2, 3, 4].includes(listId)) {
    return res.status(404).send({ error: "List not found" })
  }

  broadcast(form.name, form.description)

  res.send({ message: "Send Success!" })
}
