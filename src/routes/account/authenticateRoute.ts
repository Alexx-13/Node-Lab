import express, { Request, Response } from 'express'
import AuthenticateFilterMongo from '../../database/mongo/dataFilter/authenticateFilter'
const authenticateRouter = express.Router()
const bodyParser = require('body-parser');

authenticateRouter.use(
    express.static(process.cwd() + '/src/client/authenticate.html'),
    bodyParser.urlencoded({ extended: false })
)

authenticateRouter.use("/", async (request: Request, response: Response) => {
    let authenticateFilter = new AuthenticateFilterMongo(request, response)
    authenticateFilter.handleJWTToken()
})

export default authenticateRouter