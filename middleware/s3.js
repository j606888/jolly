const AWS = require("aws-sdk")

const bucketName = process.env.S3_BUCKET
const s3 = new AWS.S3({ apiVersion: "2006-03-01" })

const s3UploadLink = async (key) => {
  const params = { Bucket: bucketName, Key: key + ".png" }
  const url = await s3.getSignedUrl("putObject", params)
  return url
}

const s3DownloadLink = async (key) => {
  const params = { Bucket: bucketName, Key: key + ".png" }
  const url = await s3.getSignedUrl("getObject", params)
  return url
}

module.exports = {
  s3UploadLink,
  s3DownloadLink,
}
