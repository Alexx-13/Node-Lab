import express, { Request, Response } from 'express'
import CategoriesControllerMongo from '../database/mongo/controller/categoriesController'
import CategoriesControllerPostgres from '../database/postgres/controller/categoriesController'
const categoriesRouter = express.Router();

const runDBSearch = (DBName) => {
    if(DBName === 'mongo'){
        categoriesRouter.use("/", (request: Request, response: Response) => {
            const categoriesController = new CategoriesControllerMongo(request, response)
            categoriesController.makeDBSearch()
        })
    } else if (DBName === 'postgres'){
        categoriesRouter.use("/", (request: Request, response: Response) => {
            const categoriesController = new CategoriesControllerPostgres(request, response)
            categoriesController.makeDBSearch()
        })
    }
}

runDBSearch(process.argv[2])

export default categoriesRouter
