import express, { Request, Response } from 'express'
import ProfileFilterMongo from '../../database/mongo/dataFilter/profileFilter'

const profileRouter = express.Router()

const bodyParser = require('body-parser')

profileRouter.use(
    "/",
    express.static(process.cwd() + '/src/client/profileData.html'),
    bodyParser.urlencoded({ extended: false }),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        await profileFilterMongo.checkForAuthetication()
        profileFilterMongo.updateAccountDataCollection()
    }
)


profileRouter.use(
    "/password",
    express.static(process.cwd() + '/src/client/profilePassword.html'),
    bodyParser.urlencoded({ extended: false }),
    async (request: Request, response: Response) => {
        let profileFilterMongo = new ProfileFilterMongo(request, response)
        await profileFilterMongo.checkForAuthetication()
        profileFilterMongo.updateAccountPasswordCollection()
    }
)

export default profileRouter