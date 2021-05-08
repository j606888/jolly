const { deepStrictEqual } = require("assert")
const aws = require("aws-sdk")
const fs = require("fs")

function encrypt(buffer) {
  const kms = new aws.KMS({
    region: "ap-southeast-1",
  })

  return new Promise((resolve, reject) => {
    const params = {
      KeyId: "bc783961-4919-48ef-ae39-c4085f1a7bf7",
      Plaintext: JSON.stringify(buffer),
    }
    kms.encrypt(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.CiphertextBlob)
      }
    })
  })
}

// encrypt({name: "james"}).then(result => {
//   // console.log("Result: ", result)
//   fs.writeFile("kms.env", result, function(err) {
//     if(err) {
//       console.log("Err: ", err)
//     } else {
//       console.log("File created")
//     }
//   })
// })

function decrypt(buffer) {
  const kms = new aws.KMS({
    region: "ap-southeast-1",
  })

  return new Promise((resolve, reject) => {
    const params = {
      CiphertextBlob: buffer
    }
    kms.decrypt(params, (err, data) => {
      if(err) {
        reject(err)
      } else {
        resolve(data.Plaintext)
      }
    })
  })
}

fs.readFile("kms.env", (err, data) => {
  decrypt(data).then(result => {
    console.log(result.toString());
  })
})