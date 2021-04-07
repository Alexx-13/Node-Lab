import express, { Response } from 'express'
import AdminControllerMongo from '../../database/mongo/controller/adminController'
import AdminControllerPostgres from '../../database/postgres/controller/adminCategoriesController'
const adminProductsRouter = express.Router()
import { UserRole } from '../../enum'
import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {
    const current = 'categories'

    if(DBName === 'mongo'){
        adminProductsRouter.get("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerMongo(request, response, current)
                    adminController.makeDBSearchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerMongo(request, response, current)
                    adminController.makeDBPost()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.delete("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerMongo(request, response, current)
                    adminController.makeDBDeleteById()
                }  else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.patch("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerMongo(request, response, current)
                    adminController.makeDBPatchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

    } else if (DBName === 'postgres'){
        adminProductsRouter.get("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.makeDBSearchById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.makeDBPost()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.delete("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
                    const adminController = new AdminControllerPostgres(request, response)
                    adminController.makeDBDeleteById()
                } else {
                    response.send('You are unauthenticated' + request.session.isAuth)
                }
            }
        )

        adminProductsRouter.patch("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request, response: Response) => {
                if(process.argv[3] === 'true' && process.argv[4] === UserRole.admin){
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

export default adminProductsRouter