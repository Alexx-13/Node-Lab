import express, { Request, Response } from 'express'
import TokenControllerMongo from '../../database/mongo/controller/tokenController'
import TokenControllerPostgres from '../../database/postgres/controller/tokenController'
const tokenRouter = express.Router()

import bodyParser from 'body-parser'


const runDBSearch = (DBName) => {
    if(DBName === 'mongo'){
        tokenRouter.get("/",
            express.static(process.cwd() + '/src/client/token.html'),
            bodyParser.urlencoded({ extended: false })
        )

        tokenRouter.post("/",
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const tokenController = new TokenControllerMongo(request, response)
                tokenController.updateToken()
            }
        )
    } else if (DBName === 'postgres'){
        tokenRouter.get("/",
            express.static(process.cwd() + '/src/client/token.html'),
            bodyParser.urlencoded({ extended: false })
        )

        tokenRouter.use("/",
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const tokenController = new TokenControllerPostgres(request, response)
                tokenController.updateToken()
            }
        )
    }
}

runDBSearch(process.argv[2])

export default tokenRouter