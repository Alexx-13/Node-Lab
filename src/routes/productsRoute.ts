import express, { Request, Response } from 'express'
// import { ProductsModel } from '../database/mongo/models' // mongo
// import paginationHandler from '../database/mongo/pagination' // mongo
// import productsFilter from '../database/mongo/dataFilter/productsFilter' // mongo

import productsFilter from '../database/postgres/dataFilter/productsFilter' // postgres
const productRouter = express.Router()

// productRouter.use("/", paginationHandler(ProductsModel), async (request: Request, response: Response) => {
//     console.log(productsFilter(request, response))
// })

productRouter.use("/", async (request: Request, response: Response) => {
    console.log(productsFilter(request, response))
})


module.exports = productRouter