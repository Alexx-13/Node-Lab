import express, { Request, Response } from 'express'
import categoriesFilter from '../database/mongo/dataFilter/categoriesFilter'
const categoriesRouter = express.Router();
 
categoriesRouter.use("/", async (request: Request, response: Response) => {
    console.log(await categoriesFilter(request, response))
})

// if(process.argv[2] === 'mongo'){
//     const categoriesFilter = require('../database/mongo/dataFilter/categoriesFilter')
    
//     categoriesRouter.use("/", (request: Request, response: Response) => {
//         console.log(categoriesFilter(request, response))
//     })
// } else if (process.argv[2] === 'postgres'){
//     const categoriesFilter = require('../database/postgres/dataFilter/categoriesFilter')

//     categoriesRouter.use("/", (request: Request, response: Response) => {
//         console.log(categoriesFilter(request, response))
//     })
// }


module.exports = categoriesRouter