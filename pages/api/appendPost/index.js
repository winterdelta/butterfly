const faunadb = require('faunadb')
const secret = process.env.FAUNADB_SECRET_KEY
const q = faunadb.query
const client = new faunadb.Client({ secret })

module.exports = async (req, res) => {
  try {
    const { formData, audioURLFromS3, imageName, recordingTime } = req.body
    const { transcription } = formData

    // console.log('transcription feeding through: ', transcription)

    const dbs = await client.query(
      q.Create(q.Collection('chrysalis'), {
        data: {
          transcript: transcription,
          audio: audioURLFromS3,
          datetime: recordingTime,
          image: `${
            imageName
              ? `https://waveforms.s3.us-east-2.amazonaws.com/images/${imageName}`
              : 'https://waveforms.s3.us-east-2.amazonaws.com/images/Frame+13.png'
          }`
        }
      })
    )
    res.status(200).json(dbs.data)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
