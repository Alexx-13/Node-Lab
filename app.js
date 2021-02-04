const mongoose = require('mongoose')
const express = require('express')
const app = express()
const PORT = 3000 || process.env.PORT
const PASSWORD = require('dotenv').config().parsed.MONGO_DB_PASSWORD
const DBNAME = require('dotenv').config().parsed.MONGO_DB_DB_NAME
const { 
  pathRoot,
  pathProduct 
} = require('./routes')

mongoose.connect(`mongodb+srv://Alexx:${PASSWORD}@cluster0.l1zle.mongodb.net/${DBNAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

app.get(pathRoot, (req, res) => {
  res.send('GENERAL')
})

app.get(pathProduct, (req, res) => {
  db.collection("categories").findOne({}, function (err, result) {
    if (err) throw err;
    res.send(result.displayName)
  });
})

app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})

module.exports = { 
  db 
}