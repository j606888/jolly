const fs = require("fs")
const morgan = require("morgan")

const accessLogStream = fs.createWriteStream("access.log",{ flags: "a" })

module.exports = {
  log: morgan(
    '[:date[iso]] :method :url :status - :response-time ms, Body: :body, Authorization: ":header"',
    { stream: accessLogStream }
  ),
  stdout: morgan(
    '[:date[iso]] :method :url :status - :response-time ms, Body: :body, Authorization: ":header"'
  ),
}