import express, { Request, Response } from 'express'
const bodyParser = require('body-parser');

const registerRouter = express.Router()

registerRouter.use(bodyParser)

registerRouter.get("/",(request: Request, response: Response) => {
    response.sendFile(process.cwd() + '/src/client/register.html')
})

registerRouter.post("/", (request, response: Response) => {
    console.log(request.body)
})

export default registerRouter