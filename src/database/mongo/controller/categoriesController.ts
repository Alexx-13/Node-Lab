import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames } from '../../../enum'
import { db } from '../../../app'
import { CategoriesGeneralController } from '../../generalController'

interface ICategoriesControllerMongo {
    request: Request
    response: Response
    includeProducts?: boolean | undefined
    includeTop3Products?: number | undefined
    requestStr: { [queryParam: string]: string }
    finalQuery: Object | undefined
    collectionName: string
}

export default class CategoriesControllerMongo implements ICategoriesControllerMongo {
    readonly request: Request
    readonly response: Response
    public includeProducts: boolean | undefined
    public includeTop3Products: number | undefined
    public requestStr: { [queryParam: string]: string }
    public finalQuery
    public collectionName = CollectionNames.categories
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }       

    setFindQuery(){
        this.finalQuery = new Object()
        let categoriesFinder = new CategoriesGeneralController(this.request, this.response)

        if(this.requestStr.id){
            this.finalQuery._id = categoriesFinder.getCategoryId()
        }

        return this.finalQuery
    }

    getFindQuery(){
        return this.setFindQuery()
    }

    setDetailedFindQuery(){
        let categoriesFinder = new CategoriesGeneralController(this.request, this.response)

        if(this.requestStr.includeProducts){
            this.finalQuery.includeProducts = categoriesFinder.getIncludeProducts()
        }

        if(this.requestStr.includeTop3Products){
            this.finalQuery.includeTop3Products = categoriesFinder.getIncludeTop3Products()
        }

        return this.finalQuery
    }

    getDetailedFindQuery(){
        return this.setDetailedFindQuery()
    }

    makeDBSearch(){
        this.getFindQuery()

        db.default.collection(this.collectionName).find(this.getFindQuery()).toArray((err, results) => {
            if (err){
                throw err
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.NOT_FOUND);
            } else {
                this.getDetailedFindQuery()

                if(this.finalQuery.includeProducts && this.finalQuery.includeTop3Products){
                    db.default.collection(this.collectionName).aggregate([
                        {
                            $lookup:
                            {
                                from: CollectionNames.products,
                                localField: '_id',
                                foreignField: 'categoriesIds',
                                as: CollectionNames.products
                            }
                        }
                    ]).toArray((err, results) => {
                        if (err) {
                            throw err
                        } else if (results.length === 0) {
                            this.response.send(HTTPStatusCodes.NOT_FOUND);
                        } else {
                            return this.response.send(JSON.stringify(results))
                        }
                    })
                } else {
                    return this.response.send(JSON.stringify(results))
                }
            }
        })
    }
}
