import express, { Request } from 'express'
import { Response } from 'express/lib/response'
import { CategoryModel } from '../database/mongo/models'
const productRouter = express.Router()

productRouter.use("/", async (request: Request, response: Response) => {
    const data = await CategoryModel.create({ displayName: 'Some text' })
    response.send(data.displayName)
})

module.exports = productRouter