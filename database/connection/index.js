const mongoose = require('mongoose')
const PASSWORD = require('dotenv').config().parsed.MONGO_DB_PASSWORD
const DBNAME = require('dotenv').config().parsed.MONGO_DB_DB_NAME



mongoose.connect(`mongodb+srv://Alexx:${PASSWORD}@cluster0.l1zle.mongodb.net/${DBNAME}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection


db.on('connected', () => {
    console.log('The DB was successfully connected')
})

db.on('disconnected', () => {
    console.log('The DB was disconnected')
})

db.on('error', (err) => {
    console.log(`Error during DB connection attempts: ${err}`)
})

process.on('SIGINT', () => {
    db.close(() => {
        console.log('The DB connection was closed due to process termination')
        process.exit(0)
    })
})