const { Client } = require('pg')
const PASSWORD = require('dotenv').config().parsed.POSTGRES_DB_PASSWORD
const USERNAME = require('dotenv').config().parsed.POSTGRES_DB_USERNAME

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: USERNAME,
  password: PASSWORD,
})

client.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('The Postgres DB was successfully connected')
    }
})

export default client