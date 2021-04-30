const express = require("express")
const bodyParser = require("body-parser")
const userRouter = require("./router/user")
const FormRouter = require("./router/form")
const app = express()

app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Jolly Server</h1>")
})

app.use("/api/v1", userRouter)
app.use("/api/v1", FormRouter)

app.listen(3000)

console.log("Server is running on port 3000")
