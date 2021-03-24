import express, { Response } from 'express'
import AdminFilterMongo from '../../database/mongo/dataFilter/adminFilter'
import AdminFilterPostgres from '../../database/postgres/dataFilter/adminFilter'
const adminProductsRouter = express.Router()
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'

const runDBSearch = (DBName) => {
    adminProductsRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    if(DBName === 'mongo'){
        adminProductsRouter.get("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterMongo(request, response)
                    adminFilter.makeDBSearchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterMongo(request, response)
                    adminFilter.makeDBPost()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.delete("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterMongo(request, response)
                    adminFilter.makeDBDeleteById()
                }  else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.patch("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterMongo(request, response)
                    adminFilter.getDBPatchByIdQuery()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

    } else if (DBName === 'postgres'){
        adminProductsRouter.get("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterPostgres(request, response)
                    adminFilter.makeDBSearchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterPostgres(request, response)
                    adminFilter.makeDBPost()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.delete("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterPostgres(request, response)
                    adminFilter.makeDBDeleteById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.patch("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminFilter = new AdminFilterPostgres(request, response)
                    adminFilter.getDBPatchByIdQuery()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )
    }
}

runDBSearch(process.argv[2])

export default adminProductsRouter