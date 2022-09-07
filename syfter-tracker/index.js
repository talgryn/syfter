import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose';
import routes from './routes/routes.js'
import bodyParser from 'body-parser'
import nocache from 'nocache'
dotenv.config()



const app = express()

app.use(nocache())
// app.use(express.json())

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.get('/all-scans', (req, res) => {
  res.send('scans')
})

app.use('/api', routes)

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})