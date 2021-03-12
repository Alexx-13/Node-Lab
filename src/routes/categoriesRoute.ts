import express, { Request, Response } from 'express'
import CategoriesFilterPostgres from '../database/postgres/dataFilter/categoriesFilter'
import CategoriesFilterMongo from '../database/mongo/dataFilter/categoriesFilter'
const categoriesRouter = express.Router();

const runDBSearch = (DBName) => {
    if(DBName === 'mongo'){
        categoriesRouter.use("/", (request: Request, response: Response) => {
            let categoriesFilter = new CategoriesFilterMongo(request, response)
            categoriesFilter.makeDBSearch()
        })
    } else if (DBName === 'postgres'){
        categoriesRouter.use("/", (request: Request, response: Response) => {
            let categoriesFilter = new CategoriesFilterPostgres(request, response)
            categoriesFilter.makeDBSearch()
        })
    }
}

runDBSearch(process.argv[2])

module.exports = categoriesRouter
