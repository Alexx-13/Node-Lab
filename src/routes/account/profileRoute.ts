import express, { Request, Response } from 'express'
import ProfileFilterMongo from '../../database/mongo/dataFilter/profileFilter'

const profileRouter = express.Router()

const bodyParser = require('body-parser')

profileRouter.use(
    "/",
    bodyParser.urlencoded({ extended: false }),
    express.static(process.cwd() + '/src/client/profileData.html'),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        profileFilterMongo.updateAccountDataCollection()
    }
)

profileRouter.use(
    "/password",
    bodyParser.urlencoded({ extended: false }),
    express.static(process.cwd() + '/src/client/profilePassword.html'),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        profileFilterMongo.updateAccountPasswordCollection()
    }
)

export default profileRouter