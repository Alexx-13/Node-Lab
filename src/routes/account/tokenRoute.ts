import express, { Request, Response } from 'express'
import TokenFilterMongo from '../../database/mongo/dataFilter/tokenFilter'
import TokenFilterPostgres from '../../database/postgres/dataFilter/tokenFilter'
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
                const tokenFilter = new TokenFilterMongo(request, response)
                tokenFilter.updateToken()
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
                const tokenFilter = new TokenFilterPostgres(request, response)
                tokenFilter.updateToken()
            }
        )
    }
}

runDBSearch(process.argv[2])

export default tokenRouter