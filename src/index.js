const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require('cors')
const authRouter = require("../router/auth")
const userRouter = require("../router/user")
const FormRouter = require("../router/form")
const ResponseRouter = require("../router/response")
const BroadCastRouter = require("../router/broadcast")
const { log, stdout } = require('../middleware/log')
const app = express()
app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
morgan.token('header', function (req, res) { return req.headers.authorization })

app.use(log)
app.use(stdout)

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Jolly Server</h1>")
})

app.use("/api/v1", [
  authRouter,
  userRouter,
  FormRouter,
  ResponseRouter,
  BroadCastRouter,
])

app.use((err, req, res, next) => {
  console.log(err.stack)
  return res.status(500).json({ error: err.toString() })
});

app.listen(3000)

console.log("Server is running on port 3000")