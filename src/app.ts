import { Express, Server } from "express"
import { logger } from './database/service'
import router from "./routes"
import "reflect-metadata"

let db

if (process.argv[2] === 'mongo'){
  db = require('./database/mongo')
} else if (process.argv[2] === 'postgres'){
  db = require('./database/postgres')
} else {
  console.log('DB was not selected')
}

const express: Express = require('express')
const app: Server = express()
const PORT: Number | String = 3000 || process.env.PORT

app.use(logger)
app.use(router)

app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})

export default db