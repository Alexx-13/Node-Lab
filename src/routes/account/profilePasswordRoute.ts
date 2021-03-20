import express, { Request, Response } from 'express'
import ProfileFilterMongo from '../../database/mongo/dataFilter/profileFilter'
import ProfileFilterPostgres from '../../database/postgres/dataFilter/profileFilter'
const cookieSession = require('cookie-session')

const profilePasswordRouter = express.Router()

const bodyParser = require('body-parser')

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
                response.sendFile(process.cwd() + '/src/client/profilePassword.html')
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
                    let profileFilterMongo = new ProfileFilterMongo(request, response)
                    profileFilterMongo.updateAccountPasswordCollection()
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
                    let profileFilterMongo = new ProfileFilterPostgres(request, response)
                    profileFilterMongo.updateAccountPasswordCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )
    }
}

runDBSearch(process.argv[2])

export default profilePasswordRouter