import express, { Request, Response } from 'express'
import AuthenticateFilterMongo from '../../database/mongo/dataFilter/authenticateFilter'
import AuthenticateFilterPostgres from '../../database/postgres/dataFilter/authenticateFilter'
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
                const authenticateFilter = new AuthenticateFilterMongo(request, response)
                authenticateFilter.getToken()
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
                const authenticateFilter = new AuthenticateFilterPostgres(request, response)
                authenticateFilter.getToken()
            }
        )
    }
}

runDBSearch(process.argv[2])

export default authenticateRouter