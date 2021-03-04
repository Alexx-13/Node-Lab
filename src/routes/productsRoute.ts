import express, { Request, Response } from 'express'
import { ProductsModel } from '../database/mongo/models'
import paginationHandler from '../database/mongo/pagination'
import productsFilter from '../database/mongo/dataFilter/productsFilter'

const productRouter = express.Router()

productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
    console.log(await productsFilter(request, response))
})

// if (process.argv[2] === 'mongo'){
//     const { ProductsModel } = require('../database/mongo/models')
//     const paginationHandler = require('../database/mongo/pagination')
//     const productsFilter = require('../database/mongo/dataFilter/productsFilter')

//     productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
//         console.log(productsFilter(request, response))
//     })
// } else if (process.argv[2] === 'postgres'){
//     const productsFilter = require('../database/postgres/dataFilter/productsFilter')

//     productRouter.use("/", async (request: Request, response: Response) => {
//         console.log(productsFilter(request, response))
//     })
// }

module.exports = productRouter