const request = require("request")

module.exports = (title, text) => {
  const body = {
    attachments: [
      {
        color: "success",
        author_name: "新問卷來啦！",
        title: `[標題] ${title}`,
        text,
      },
    ],
  }

  request.post({
    url: "https://chat.kdan.cc/hooks/dw1pgsedtbnyunkeqsqq7aptne",
    headers: {
      "content-type": "application/json",
    },
    body: body,
    json: true,
  })
}
