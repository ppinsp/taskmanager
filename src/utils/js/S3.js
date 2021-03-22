const aws = require('aws-sdk')

const endpoint = new aws.Endpoint('sfo2.digitaloceanspaces.com')
const bucketUrl = 'https://task-management.sfo2.digitaloceanspaces.com'

const s3 = new aws.S3({
  endpoint,
  accessKeyId: 'Q5UVZCES7NSUDUVAORYN',
  secretAccessKey: 'TroMfIU2q5mD1zeS6OywdNY58e6T24jsH2QvXWNHnLA',
  ServerAddress: "task-management.sfo2.digitaloceanspaces.com",
  params: {
    Bucket: 'task-management'
  }
})

export const uploadToBucket = (file, extension) => {
  let fileName = (new Date() / 1 + '')
  let params = {
    'Key': `${fileName}.${extension}`,
    'ContentType': file.type,
    'Body': file,
    'ACL': 'public-read'
  }

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-unused-vars
    s3.putObject(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(`${bucketUrl}/${this.request.params.Key}`)
      }
    })
  })
}
