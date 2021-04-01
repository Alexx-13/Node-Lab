import { Server } from "express"
import { 
  logger,
  collectionCleanUpHandlerMongo, 
  collectionCleanUpHandlerPostgres
} from './service'

import router from "./routes"
import "reflect-metadata"
import express from 'express'
const socket = require('socket.io')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const app: Server = express()
const PORT: number | string = 3000 || process.env.PORT

let db

if (process.argv[2] === 'mongo'){
  db = require('./database/mongo')
  collectionCleanUpHandlerMongo(db, 'lastRatings')
} else if (process.argv[2] === 'postgres'){
  db = require('./database/postgres')
  collectionCleanUpHandlerPostgres(db, 'lastRatings')
} else {
  console.log('DB was not selected')
}

app.get("/", (request, response) => {
  response.sendFile((__dirname + '/client/client.html'))
})

app.use(logger)
app.use(router)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})

const io = socket(server)

export { db, io }