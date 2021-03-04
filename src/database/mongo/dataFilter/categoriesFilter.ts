import { Request, Response } from 'express'
import { CategoryModel } from '../models/index'
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
        public finalQuery
        public includeProducts
        public includeTop3Products

        getIncludeProducts(){
            try {
                if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                    this.includeProducts = true
                } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                    this.includeProducts = false
                }
            } catch (err) {
                throw new err
            }
        }

        getIncludeTop3Products(){
            try {
                if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                    this.includeTop3Products = 3
                }
            } catch (err) {
                throw new err
            }
        }

        createFinalQuery(){
            this.finalQuery = new Object()
            this.getIncludeProducts()
            if(this.includeProducts){
                this.getIncludeTop3Products()
                if(this.includeProducts === true && this.includeTop3Products === 3){
                    db.default.collection("categories").aggregate([
                        {
                            $lookup:
                            {
                                from: 'products',
                                localField: 'displayName',
                                foreignField: 'displayName',
                                as: 'products'
                            }
                        }
                    ]).toArray(function(err, result) {
                        if (err) throw err;
                        console.log(JSON.stringify(result))
                    })
                }   
            }
        }

    }

    let queryParams = new QueryParams()
    console.log(queryParams.createFinalQuery())


}

export default categoriesFilter