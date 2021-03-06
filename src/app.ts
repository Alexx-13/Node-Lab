import { Server } from "express"
import { CollectionNames } from './enum'
import { 
  logger,
  collectionCleanUpHandlerMongo, 
  collectionCleanUpHandlerPostgres
} from './service'

import router from "./routes"
import "reflect-metadata"
import express from 'express'
const socket = require('socket.io')

const app: Server = express()
const PORT: number | string = 3000 || process.env.PORT

let db

if (process.argv[2] === 'mongo'){
  db = require('./database/mongo')
  collectionCleanUpHandlerMongo(db, CollectionNames.ratings)
} else if (process.argv[2] === 'postgres'){
  db = require('./database/postgres')
  collectionCleanUpHandlerPostgres(db, CollectionNames.ratings)
} else {
  console.log('DB was not selected')
}

app.get("/", (request, response) => {
  response.sendFile((__dirname + '/client/client.html'))
})

app.use(logger)
app.use(router)

const server = app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})

const io = socket(server)

export { db, io }