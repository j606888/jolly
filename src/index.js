const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const authRouter = require("../router/auth")
const userRouter = require("../router/user")
const FormRouter = require("../router/form")
const ResponseRouter = require("../router/response")
const BroadCastRouter = require("../router/broadcast")
const app = express()

// const winston = require("winston")

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     winston.format.errors({stack: true}),
//     winston.format.splat(),
//     winston.format.json(),
//   ),
//   defaultMeta: { service: "jolly_service" },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error'}),
//     new winston.transports.File({ filename: 'combined.log'})
//   ]
// })

// if (process.env.NODE_ENV !== 'production' ) {
//   logger.add(new winston.transports.Console({
//     format: winston.format.combine(
//       winston.format.colorize(),
//       winston.format.simple()
//     )    
//   }))
// }

app.use(bodyParser.json())

app.use(morgan("dev"))

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

app.listen(3000)

console.log("Server is running on port 3000")