import express, { Request, Response } from 'express'
import ProfileFilterMongo from '../../database/mongo/dataFilter/profileFilter'
import ProfileFilterPostgres from '../../database/postgres/dataFilter/profileFilter'
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
                const profileFilterMongo = new ProfileFilterMongo(request, response)
                profileFilterMongo.updateAccountDataCollection()
            }
        )

    } else if (DBName === 'postgres'){
        profileRouter.post(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const profileFilterMongo = new ProfileFilterPostgres(request, response)
                    profileFilterMongo.updateAccountPasswordCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )
    }
}

runDBSearch(process.argv[2])

export default profileRouter
