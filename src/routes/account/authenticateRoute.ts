import express, { Request, Response } from 'express'

const authenticateRouter = express.Router()

authenticateRouter.use("/", async (request: Request, response: Response) => {
    
})

export default authenticateRouter