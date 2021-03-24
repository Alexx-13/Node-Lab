import express, { Request, Response } from 'express'
import { ProductsModel } from '../database/mongo/models'
import paginationHandler from '../database/mongo/pagination'
import ProductsFilterMongo from '../database/mongo/dataFilter/productsFilter'
import ProductsFilterPostgres from '../database/postgres/dataFilter/productsFilter'
const productRouter = express.Router()
import cookieSession from 'cookie-session'

const runDBSearch = (DBName) => {
    productRouter.use(cookieSession({
        name: 'session',
        keys: ['key1', 'key2']
    }))

    if (DBName === 'mongo'){
        productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
            const productsFilter = new ProductsFilterMongo(request, response)
            productsFilter.makeDBSearch()
        })

        productRouter.post("/:id/rate/:value", paginationHandler(ProductsModel), async (request, response: Response) => {
            if(request.session.isAuth === true){ // add ROLE BUYER CHECK
                const productsFilter = new ProductsFilterMongo(request, response)
                productsFilter.makeDBRatingUpdate()
            }
        })

    } else if (DBName === 'postgres'){
        productRouter.use("/", async (request: Request, response: Response) => {
            const productsFilter = new ProductsFilterPostgres(request, response)
            productsFilter.makeDBSearch()
        })
    }
}

runDBSearch(process.argv[2])

export default productRouter
