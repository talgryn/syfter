import express from 'express'
import dotenv from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb';
dotenv.config()
const router = express.Router()


let db
let scans
MongoClient.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      console.error(err)
      return
    }
    db = client.db("scans")
    scans = db.collection('scans')
  }
)


router.get('/scans', async (req, res) => {
    const dbres = (await scans.find().toArray()).map((s) => s._id)
    res.send(dbres)
})

router.get('/scans/:id', async (req, res) => {
    console.log(`id: ${req.params.id}`)
    const dbres = await scans.findOne({_id: ObjectId(req.params.id)})
    res.send(dbres)
})

router.post('/scans', async (req, res) => {
    console.log(`body: ${req.body}`)
    let dbres = await scans.insertOne(req.body)
    console.log(`res: ${dbres}`)
    res.send({message: 'success', id: dbres.insertedId})
})

export default router
