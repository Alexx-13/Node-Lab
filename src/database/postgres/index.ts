import { CollectionNames } from '../../enum'
import { getLocalAccessToken } from '../../service'
const Pool = require('pg').Pool
const PASSWORD = require('dotenv').config().parsed.POSTGRES_DB_PASSWORD
const USERNAME = require('dotenv').config().parsed.POSTGRES_DB_USERNAME


const db = new Pool({
  host: 'localhost',
  port: 5432,
  user: USERNAME,
  password: PASSWORD,
})

db.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('The Postgres DB was successfully connected')
        db.collection(CollectionNames.account).query(
            `SELECT accessToken FROM ${CollectionNames.account} WHEN accessToken = ${getLocalAccessToken()}`,
            (err, results) => {
                if(err){
                    process.argv[3] = 'false'
                } else {
                    process.argv[3] = 'true'
                }
            }
        )
    }
})

export default db