import express, { Request, Response } from 'express'
import ProfileFilterMongo from '../../database/mongo/dataFilter/profileFilter'

const profileRouter = express.Router()

const bodyParser = require('body-parser')

profileRouter.get(
    "/",
    bodyParser.urlencoded({ extended: false }),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        await profileFilterMongo.checkForAuthetication('/src/client/profileData.html')
    }
)

profileRouter.post(
    "/",
    bodyParser.urlencoded({ extended: false }),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        profileFilterMongo.updateAccountDataCollection()
    }
)

profileRouter.get(
    "/password",
    bodyParser.urlencoded({ extended: false }),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        await profileFilterMongo.checkForAuthetication('/src/client/profilePassword.html')
    }
)

profileRouter.use(
    "/password",
    bodyParser.urlencoded({ extended: false }),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        profileFilterMongo.updateAccountPasswordCollection()
    }
)

export default profileRouter