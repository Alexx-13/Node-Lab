import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
// import { CategoryModel } from '../models/index'
import db from '../../../app'

const categoriesFilter = async (request: Request, response: Response) => {
    /* Schemas creation snippets */
    // const dataA = await CategoryModel.create({ 
    //     displayName: 'Game1'
    // })

    interface IQueryParams {
        includeProducts?: boolean
        includeTop3Products?: number
    }

    class QueryParams implements IQueryParams {
        readonly requestStr = request.query
        readonly collectionName = 'categories'
        public includeProducts
        public includeTop3Products

        getIncludeProducts(){
            try {
                if(this.requestStr.includeProducts){
                    if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                        this.includeProducts = true
                    } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                        this.includeProducts = false
                    } else {
                        response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
                    }
                }
            } catch (err) {
                throw new err
            }
        }

        getIncludeTop3Products(){
            try {
                if(this.requestStr.includeTop3Products){
                    if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                        this.includeTop3Products = 3
                    } else {
                        response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
                    } 
                }
            } catch (err) {
                throw new err
            }
        }

        makeDBSearch(){
            this.getIncludeProducts()
        
            if(this.includeProducts === false || this.includeProducts === true){
                this.getIncludeTop3Products()
                if(this.includeProducts === true && this.includeTop3Products === 3){
                    db.default.collection(this.collectionName).aggregate([
                        {
                            $lookup:
                            {
                                from: 'products',
                                localField: 'displayName',
                                foreignField: 'displayName',
                                as: 'products'
                            }
                        }
                    ]).toArray((err, result) => {
                        if (err){
                            throw err
                        } else if(result.length === 0){
                            response.send(HTTPStatusCodes.NOT_FOUND);
                        } else {
                            return response.send(JSON.stringify(result))
                        }
                    })
                }   
            } else if(this.includeProducts === undefined){
                db.default.collection(this.collectionName).find({}).toArray((err, result) => {
                    if (err){
                        throw err
                    } else if(result.length === 0){
                        response.send(HTTPStatusCodes.NOT_FOUND);
                    } else {
                        return response.send(JSON.stringify(result))
                    }
                })
            }
        }

    }

    let queryParams = new QueryParams()
    queryParams.makeDBSearch()
}

export default categoriesFilter

