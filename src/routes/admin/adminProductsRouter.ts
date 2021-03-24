import express, { Request, Response } from 'express'
import AdminFilterMongo from '../../database/mongo/dataFilter/adminFilter'
// import AdminFilterPostgres from '../../database/postgres/dataFilter/adminFilter'
const adminProductsRouter = express.Router()
import bodyParser from 'body-parser'

const runDBSearch = (DBName) => {
    if(DBName === 'mongo'){
        adminProductsRouter.get("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const adminFilter = new AdminFilterMongo(request, response)
                adminFilter.makeDBSearchById()
            }
        )

        adminProductsRouter.post("/", 
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const adminFilter = new AdminFilterMongo(request, response)
                adminFilter.makeDBPost()
            }
        )

        adminProductsRouter.delete("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const adminFilter = new AdminFilterMongo(request, response)
                adminFilter.makeDBDeleteById()
            }
        )

        adminProductsRouter.patch("/:id", 
            bodyParser.urlencoded({ extended: false }),
            async (request: Request, response: Response) => {
                const adminFilter = new AdminFilterMongo(request, response)
                adminFilter.getDBPatchByIdQuery()
            }
        )

    } 
    // else if (DBName === 'postgres'){
    //     adminRouter.get("/",
    //         express.static(process.cwd() + '/src/client/authenticate.html'),
    //         bodyParser.urlencoded({ extended: false }),
    //     )

    //     adminRouter.use("/",
    //         bodyParser.urlencoded({ extended: false }),
    //         async (request: Request, response: Response) => {
    //             const adminFilter = new AdminFilterPostgres(request, response)
    //             adminFilter.getToken()
    //         }
    //     )
    // }
}

runDBSearch(process.argv[2])

export default adminProductsRouter