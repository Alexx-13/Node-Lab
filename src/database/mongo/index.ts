import { Logger } from "mongodb";
import { Connection, Mongoose } from "mongoose"
import { CollectionNames } from '../../enum'
import { getLocalAccessToken } from '../../service'
const fs = require("fs");

const mongoose: Mongoose = require('mongoose')
const PASSWORD = require('dotenv').config().parsed.MONGO_DB_PASSWORD
const DBNAME = require('dotenv').config().parsed.MONGO_DB_DB_NAME


mongoose.connect(
    `mongodb+srv://Alexx:${PASSWORD}@cluster0.l1zle.mongodb.net/${DBNAME}?retryWrites=true&w=majority`, 
    {useNewUrlParser: true, useUnifiedTopology: true}
)

const db: Connection = mongoose.connection

db.on('connected', () => {
    console.log('The MongoDB was successfully connected')

    if(process.env.NODE_ENV === 'production') {
        Logger.setLevel("debug");
        
        Logger.setCurrentLogger((context: any) => {
            fs.appendFile('./src/logs/logs.txt', JSON.stringify(context) + "\n", err => {
                if (err) {
                console.log(err);
                }
            })
        })
    } 

    db.collection(CollectionNames.account)
    .find({ accessToken: getLocalAccessToken()})
    .toArray((err, results) => {
        if(err){
            throw err
        } else if (results.length === 0){
            process.argv[3] = 'false'
        } else {
            process.argv[3] = 'true'
        }
    })



})

db.on('disconnected', () => {
    console.log('The MongoDB was disconnected')
})

db.on('error', (err) => {
    console.log(`Error during DB connection attempts: ${err}`)
})

process.on('SIGINT', () => {
    db.close(() => {
        console.log('The MongoDB connection was closed due to process termination')
        process.exit(0)
    })
})



export default db