import express, { Request, Response } from 'express'
import { ProductsModel } from '../database/mongo/models'
import paginationHandler from '../database/mongo/pagination'
import { RoleHandler } from '../service'
import ProductsControllerMongo from '../database/mongo/controller/productsController'
import ProductsControllerPostgres from '../database/postgres/controller/productsController'
import { UserRole } from '../enum'
const productRouter = express.Router()
import cookieSession from 'cookie-session'

const runDBSearch = (DBName) => {
    productRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    if (DBName === 'mongo'){
        productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
            const productsController = new ProductsControllerMongo(request, response)
            productsController.makeDBSearch()
        })

        productRouter.post("/:id/rate/:value", paginationHandler(ProductsModel), async (request, response: Response) => {
            const roleHandler = new RoleHandler(request, response)
            if (request.session.isAuth === true && roleHandler.getUserRoleMongo() === UserRole.buyer ){
                const productsController = new ProductsControllerMongo(request, response)
                productsController.makeDBRatingUpdate()
            }
        })

    } else if (DBName === 'postgres'){
        productRouter.use("/", async (request: Request, response: Response) => {
            const productsController = new ProductsControllerPostgres(request, response)
            productsController.makeDBSearch()
        })

        productRouter.post("/:id/rate/:value", paginationHandler(ProductsModel), async (request, response: Response) => {
            const roleHandler = new RoleHandler(request, response)
            if (request.session.isAuth === true && roleHandler.getUserRolePostgres() === UserRole.buyer ){
                const productsController = new ProductsControllerPostgres(request, response)
                productsController.makeDBRatingUpdate()
            }
        })
    }
}

runDBSearch(process.argv[2])

export default productRouter
