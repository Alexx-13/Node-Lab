import express, { Response } from 'express'
import AdminControllerMongo from '../../database/mongo/controller/adminCategoriesController'
import AdminControllerPostgres from '../../database/postgres/controller/adminCategoriesController'
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
                    const adminController = new AdminControllerMongo(request, response)
                    adminController.makeDBSearchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminCategoriesRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminController = new AdminControllerMongo(request, response)
                    adminController.makeDBPost()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminCategoriesRouter.delete("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminController = new AdminControllerMongo(request, response)
                    adminController.makeDBDeleteById()
                }  else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminCategoriesRouter.patch("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminController = new AdminControllerMongo(request, response)
                    adminController.getDBPatchByIdQuery()
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
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.makeDBSearchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminCategoriesRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.makeDBPost()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminCategoriesRouter.delete("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.makeDBDeleteById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminCategoriesRouter.patch("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(request.session.isAuth === true){
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.getDBPatchByIdQuery()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )
    }
}

runDBSearch(process.argv[2])

export default adminCategoriesRouter