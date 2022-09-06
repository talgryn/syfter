import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose';
import routes from './routes/routes.js'
import { MongoClient } from 'mongodb';
dotenv.config()



const app = express()

app.use(express.json())
app.get('/all-scans', (req, res) => {
  res.send('scans')
})

app.use('/api', routes)

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})