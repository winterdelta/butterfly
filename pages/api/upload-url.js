const faunadb = require('faunadb')
const { randomUUID } = require('crypto')
const secret = process.env.FAUNADB_SECRET_KEY
const q = faunadb.query
const client = new faunadb.Client({ secret })
import aws from 'aws-sdk'

module.exports = async (req, res) => {
  try {
    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEYYY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
      region: 'us-east-2',
      signatureVersion: 'v4'
    })

    const s3 = new aws.S3()
    const post = s3.createPresignedPost({
      Bucket: 'waveforms',
      Fields: {
        key: `images/${req.query.file}`,
        'Content-Type': req.query.fileType,
        ACL: 'public-read'
      },
      Expires: 60, // seconds
      Conditions: [
        ['content-length-range', 0, 10485760] // up to 10 MB
      ]
    })

    res.status(200).json(post)

    // const s3 = new AWS.S3({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_1,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
    // })

    // const uuid = randomUUID()

    // const { audioFile } = req.body.fileName

    // console.log(req.body)

    // const s3Params = {
    //   Bucket: 'waveforms',
    //   // Fields: {
    //   //   key: req.query.file
    //   // },
    //   Key: `voicememo/${uuid}.mp3`,
    //   // Body: req.query.file,
    //   ContentType: 'audio/mp3',
    //   ACL: 'public-read'
    // }

    // console.log(s3Params)

    // await s3.upload(s3Params).promise()

    // await s3.createPresignedPost({
    //   Bucket: 'waveforms',
    //   Fields: {
    //     key: `voicememo/${req.query.file}.mp3`
    //   }
    // })

    // const dbs = await client.query(
    //   q.Create(q.Collection('voicememo'), {
    //     data: {
    //       voicememo: `https://waveforms.s3.us-east-2.amazonaws.com/voicememo/${uuid}.mp3`,
    //       // note: 'retrieve the page address',
    //       user: req.session.userId
    //     }
    //   })
    // )
    // res.status(200).json(dbs.data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
