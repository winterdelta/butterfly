import faunadb from 'faunadb'
const secret = process.env.FAUNADB_SECRET_KEY
const q = faunadb.query
const client = new faunadb.Client({ secret })

module.exports = async (req, res) => {
  try {
    // const secret = await getToken({ template: 'fauna' })
    // const client = new faunadb.Client({ secret, keepAlive: false })
    // const id = await client.query(q.CurrentIdentity())

    const dbs = await client.query(
      q.Reverse(
        q.Map(
          // iterate each item in result
          q.Paginate(
            // make paginatable
            q.Match(
              // query index
              q.Index('all_chrysalis'),
              // userId // specify source
            ),
            { size: 200 }
          ),
          ref => q.Get(ref) // lookup each result by its reference
        )
      )
    )
    // ok

    res.status(200).json(dbs.data)
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message })
  }
}
