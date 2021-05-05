var AWS = require("aws-sdk")

var bucketName = "node-sdk-sample-2848e245-576b-4ad5-89e0-b502a013b495"

var keyName = "cool.txt"

var s3 = new AWS.S3({ apiVersion: "2006-03-01" })
var params = { Bucket: bucketName, Key: keyName }
s3.getSignedUrl("putObject", params, function (err, url) {
  if (err) {
    console.log("Err: ", err)
  }
  console.log("The URL is ", url)
})

// bucketPromise
//   .then(function (data) {
//     var objectParams = { Bucket: bucketName, Key: keyName, Body: "Hello World" }

//     var uploadPromise = new AWS.S3({ apiVersion: "2006-03-01" })
//       .putObject(objectParams)
//       .promise()
//     uploadPromise.then(function (data) {
//       console.log("Successfully upload data to " + bucketName + "/" + keyName)
//     })
//   })
//   .catch(function (err) {
//     console.log(err, err.stach)
//   })

// console.log("Region: ", AWS.config.region)

// AWS.config.getCredentials(function (err) {
//   if (err) console.log(err.stack)
//   else {
//     console.log("Region: ", AWS.config.region)
//     console.log("Access key: ", AWS.config.credentials.accessKeyId)
//   }
// })
