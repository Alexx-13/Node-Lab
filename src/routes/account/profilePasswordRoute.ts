import express, { Response } from 'express'
import ProfileControllerMongo from '../../database/mongo/controller/profileController'
import ProfileControllerPostgres from '../../database/postgres/controller/profileController'

const profilePasswordRouter = express.Router()

import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {
    if(DBName === 'mongo'){
        profilePasswordRouter.post(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true'){
                    console.log(process.argv[3])
                    const profileControllerMongo = new ProfileControllerMongo(request, response)
                    profileControllerMongo.updateAccountPasswordCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )

    } else if (DBName === 'postgres'){
        profilePasswordRouter.post(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true'){
                    const profileControllerMongo = new ProfileControllerPostgres(request, response)
                    profileControllerMongo.updateAccountPasswordCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )
    }
}

runDBSearch(process.argv[2])

export default profilePasswordRouter