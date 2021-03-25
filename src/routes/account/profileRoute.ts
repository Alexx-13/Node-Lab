import express, { Request, Response } from 'express'
import ProfileControllerMongo from '../../database/mongo/controller/profileController'
import ProfileControllerPostgres from '../../database/postgres/controller/profileController'
import cookieSession from 'cookie-session'

const profileRouter = express.Router()

import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {
    profileRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    profileRouter.get(
        "/",
        bodyParser.urlencoded({ extended: false }),
        (request, response) => {
            if(request.session.isAuth === true){
                response.sendFile(process.cwd() + '/src/client/profile.html')
            } else {
                response.send('You are unauthenticated' + request.session.isAuth)
            }
        }
    )

    if(DBName === 'mongo'){
        profileRouter.post(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const profileControllerMongo = new ProfileControllerMongo(request, response)
                profileControllerMongo.updateAccountDataCollection()
            }
        )

    } else if (DBName === 'postgres'){
        profileRouter.post(
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

export default profileRouter
