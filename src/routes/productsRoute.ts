import express, { Request, Response } from 'express'
import { ProductsModel } from '../database/mongo/models'
import paginationHandler from '../database/mongo/pagination'
import ProductsFilterMongo from '../database/mongo/dataFilter/productsFilter'
import ProductsFilterPostgres from '../database/postgres/dataFilter/productsFilter'
const productRouter = express.Router()

const runDBSearch = (DBName) => {
    if (DBName === 'mongo'){
        productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
            let productsFilter = new ProductsFilterMongo(request, response)
            productsFilter.makeDBSearch()
        })
    } else if (DBName === 'postgres'){
        productRouter.use("/", async (request: Request, response: Response) => {
            let productsFilter = new ProductsFilterPostgres(request, response)
            productsFilter.makeDBSearch()
        })
    }
}

runDBSearch(process.argv[2])

module.exports = productRouter
