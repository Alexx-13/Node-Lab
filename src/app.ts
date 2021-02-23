import { Express, Server } from "express"
import db from './database'
import router from "./routes"

const express: Express = require('express');
const app: Server = express();
const PORT: Number = 3000 || process.env.PORT;


db
app.use(router);

app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})