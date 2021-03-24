import express, { Response } from 'express'
import AdminFilterMongo from '../../database/mongo/dataFilter/adminCategoriesFilter'
import AdminFilterPostgres from '../../database/postgres/dataFilter/adminCategoriesFilter'
const adminCategoriesRouter = express.Router()
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'

const runDBSearch = (DBName) => {
    adminCategoriesRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    if(DBName === 'mongo'){
        adminCategoriesRouter.get("/:id", 
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

        adminCategoriesRouter.post("/", 
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

        adminCategoriesRouter.delete("/:id", 
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

        adminCategoriesRouter.patch("/:id", 
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
        adminCategoriesRouter.get("/:id", 
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

        adminCategoriesRouter.post("/", 
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

        adminCategoriesRouter.delete("/:id", 
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

        adminCategoriesRouter.patch("/:id", 
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

export default adminCategoriesRouter