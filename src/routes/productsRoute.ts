import express, { Request, Response } from 'express'
import { ProductsModel } from '../database/mongo/models'
import paginationHandler from '../database/mongo/pagination'
import productsFilterMongo from '../database/mongo/dataFilter/productsFilter'
import productsFilterPostgres from '../database/postgres/dataFilter/productsFilter'

const productRouter = express.Router()


if (process.argv[2] === 'mongo'){
    productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
        productsFilterMongo(request, response)
    })
} else if (process.argv[2] === 'postgres'){
    productRouter.use("/", async (request: Request, response: Response) => {
        productsFilterPostgres(request, response)
    })
}

export default productRouter