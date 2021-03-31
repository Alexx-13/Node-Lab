import express, { Request, Response } from 'express'
import AuthenticateControllerMongo from '../../database/mongo/controller/authenticateController'
import AuthenticateControllerPostgres from '../../database/postgres/controller/authenticateController'
const authenticateRouter = express.Router()
import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {
    if(DBName === 'mongo'){
        authenticateRouter.get("/", 
            express.static(process.cwd() + '/src/client/authenticate.html'),
            bodyParser.urlencoded({ extended: false }),
        )

        authenticateRouter.post("/", 
        bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const authenticateController = new AuthenticateControllerMongo(request, response)
                authenticateController.getToken()
            }
        )

    } else if (DBName === 'postgres'){
        authenticateRouter.get("/",
            express.static(process.cwd() + '/src/client/authenticate.html'),
            bodyParser.urlencoded({ extended: false }),
        )

        authenticateRouter.use("/",
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const authenticateController = new AuthenticateControllerPostgres(request, response)
                authenticateController.getToken()
            }
        )
    }
}

runDBSearch(process.argv[2])

export default authenticateRouter