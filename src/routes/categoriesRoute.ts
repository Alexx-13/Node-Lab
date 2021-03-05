import express, { Request, Response } from 'express'
import categoriesFilterMongo from '../database/mongo/dataFilter/categoriesFilter'
import categoriesFilterPostgres from '../database/postgres/dataFilter/categoriesFilter'
const categoriesRouter = express.Router();


if(process.argv[2] === 'mongo'){
    categoriesRouter.use("/", (request: Request, response: Response) => {
        categoriesFilterMongo(request, response)
    })
} else if (process.argv[2] === 'postgres'){
    categoriesRouter.use("/", (request: Request, response: Response) => {
        categoriesFilterPostgres(request, response)
    })
}

module.exports = categoriesRouter