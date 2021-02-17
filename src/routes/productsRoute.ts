import express, { Request } from 'express'
import { Response } from 'express/lib/response'
import { Product } from '../services/ProductService/productsInterfaces'
import * as productsService from '../services/ProductService/productsService'
const productRouter = express.Router()

productRouter.use("/", (request: Request, response: Response) => {
    const product: Product = productsService.addProduct(request.params['name'])
    response.send(product.name)
})

module.exports = productRouter