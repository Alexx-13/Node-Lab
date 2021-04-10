import express, { Request, Response } from 'express'
import { ProductsModel } from '../database/mongo/models'
import paginationHandler from '../database/mongo/pagination'
import ProductsControllerMongo from '../database/mongo/controller/productsController'
import ProductsControllerPostgres from '../database/postgres/controller/productsController'
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

    } else if (DBName === 'postgres'){
        productRouter.use("/", async (request: Request, response: Response) => {
            const productsController = new ProductsControllerPostgres(request, response)
            productsController.makeDBSearch()
        })
    }
}

runDBSearch(process.argv[2])

export default productRouter
