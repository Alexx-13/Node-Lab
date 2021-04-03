import express, { Response } from 'express'
import RegisterControllerMongo from '../../database/mongo/controller/registerController'
import RegisterControllerPostgres from '../../database/postgres/controller/registerController'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'

const registerRouter = express.Router()

const runDBSearch = (DBName) => {
    registerRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    if(DBName === 'mongo'){
        // registerRouter.get("/", 
        //     express.static(process.cwd() + '/src/client/register.html'),
        //     bodyParser.urlencoded({ extended: false }),
        // )

        registerRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                const registerController = new RegisterControllerMongo(request, response)
                registerController.setAccountCollection()
            }
        )

    } else if (DBName === 'postgres'){
        // registerRouter.get("/",
        //     express.static(process.cwd() + '/src/client/register.html'),
        //     bodyParser.urlencoded({ extended: false }),
        // )


        registerRouter.post("/",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                const registerController = new RegisterControllerPostgres(request, response)
                registerController.setAccountCollection()
            }
        )
    }
}

runDBSearch(process.argv[2])

export default registerRouter