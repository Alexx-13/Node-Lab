import express, { Response } from 'express'
import ProfileControllerMongo from '../../database/mongo/controller/profileController'
import ProfileControllerPostgres from '../../database/postgres/controller/profileController'
import cookieSession from 'cookie-session'

const profilePasswordRouter = express.Router()

import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {
    profilePasswordRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    profilePasswordRouter.get(
        "/",
        bodyParser.urlencoded({ extended: false }),
        (request, response) => {
            if(request.session.isAuth === true){
                // response.sendFile(process.cwd() + '/src/client/profilePassword.html')
                response.send('You are authenticated')
            } else {
                response.send('You are unauthenticated' + request.session.isAuth)
            }
        }
    )

    if(DBName === 'mongo'){
        profilePasswordRouter.post(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
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
                if(request.session.isAuth === true){
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