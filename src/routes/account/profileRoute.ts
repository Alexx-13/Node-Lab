import express, { Request, Response } from 'express'
import ProfileControllerMongo from '../../database/mongo/controller/profileController'
import ProfileControllerPostgres from '../../database/postgres/controller/profileController'
const profileRouter = express.Router()
import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {

    profileRouter.get(
        "/",
        bodyParser.urlencoded({ extended: false }),
        (request, response) => {
            if(process.argv[3] === 'true'){
                response.send('You are authenticated')
            } else {
                response.send('You are unauthenticated' + request.session.isAuth)
            }
        }
    )

    if(DBName === 'mongo'){
        profileRouter.post(
            "/password",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true'){
                    const profileControllerMongo = new ProfileControllerMongo(request, response)
                    profileControllerMongo.updateAccountPasswordCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )

        profileRouter.put(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                if(process.argv[3] === 'true'){
                    const profileControllerMongo = new ProfileControllerMongo(request, response)
                    profileControllerMongo.updateAccountDataCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )

    } else if (DBName === 'postgres'){
        profileRouter.post(
            "/password",
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

        profileRouter.put(
            "/",
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                if(process.argv[3] === 'true'){
                    const profileControllerMongo = new ProfileControllerMongo(request, response)
                    profileControllerMongo.updateAccountDataCollection()
                } else {
                    response.send('You are unauthenticated')
                }
            }
        )
    }
}

runDBSearch(process.argv[2])

export default profileRouter
