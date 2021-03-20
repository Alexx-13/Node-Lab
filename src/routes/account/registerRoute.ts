import express, { Response } from 'express'
import RegisterFilterMongo from '../../database/mongo/dataFilter/registerFilter'
import RegisterFilterPostgres from '../../database/postgres/dataFilter/registerFilter'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'

const registerRouter = express.Router()

const runDBSearch = (DBName) => {
    registerRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    if(DBName === 'mongo'){
        registerRouter.get("/", 
            express.static(process.cwd() + '/src/client/register.html'),
            bodyParser.urlencoded({ extended: false }),
        )

        registerRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                const registerFilter = new RegisterFilterMongo(request, response)
                registerFilter.setAccountCollection()
            }
        )

    } else if (DBName === 'postgres'){
        registerRouter.get("/",
            express.static(process.cwd() + '/src/client/register.html'),
            bodyParser.urlencoded({ extended: false }),
        )


        registerRouter.post("/",
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                const registerFilter = new RegisterFilterPostgres(request, response)
                registerFilter.setAccountCollection()
            }
        )
    }
}

runDBSearch(process.argv[2])

export default registerRouter