import express, { Response } from 'express'
import { Request } from 'express/lib/request';
const categoriesRouter = express.Router();
 
categoriesRouter.use("/", (request: Request, response: Response) => {
    response.send("Some data for categories")
})

module.exports = categoriesRouter