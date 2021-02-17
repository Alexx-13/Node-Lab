import { Express, Server } from "express";
const db = require('./database')
const express: Express = require('express')
const app: Server = express()
const PORT: Number = 3000 || process.env.PORT

import router from "./routes";

app.use(router);

app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})