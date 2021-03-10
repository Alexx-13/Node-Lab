import express, { Request, Response } from 'express'
import TokenFilterMongo from '../../database/mongo/dataFilter/tokenFilter'
const tokenRouter = express.Router()

const bodyParser = require('body-parser')

tokenRouter.use(
    express.static(process.cwd() + '/src/client/token.html'),
    bodyParser.urlencoded({ extended: false })
)

tokenRouter.use("/", async (request: Request, response: Response) => {
    let tokenFilter = new TokenFilterMongo(request, response)
    tokenFilter.updateToken()
})

export default tokenRouter