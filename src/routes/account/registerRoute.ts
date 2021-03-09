import express, { Request, Response } from 'express'
import RegisterFilterMongo from '../../database/mongo/dataFilter/registerFilter'
const bodyParser = require('body-parser');

const registerRouter = express.Router()

registerRouter.use(
    express.static(process.cwd() + '/src/client/register.html'),
    bodyParser.urlencoded({ extended: false })
)

registerRouter.use("/", async (request, response: Response) => {
    let registerFilter = new RegisterFilterMongo(request, response)
    registerFilter.setAccountCollection()
})

export default registerRouter