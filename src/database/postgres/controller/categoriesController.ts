import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames } from '../../../enum'
import { db } from '../../../app'
import { CategoriesGeneralController } from '../../generalController'

interface ICategoriesControllerPostgres {
    request: Request
    response: Response
    requestStr: { [queryParam: string]: string }
    finalQuery: Object | undefined
    collectionName: string

    setFindQuery()
    getFindQuery()
    setDetailedFindQuery()
    getDetailedFindQuery()
    makeDBSearch()
}

export default class CategoriesControllerPostgres implements ICategoriesControllerPostgres {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public finalQuery
    public collectionName = CollectionNames.categories
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }      

    setFindQuery(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

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
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

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
       const customQuery = `SELECT * FROM ${this.collectionName}
       ON ${this.collectionName}._id = ${CollectionNames.products}.categoriesIds
       `

        db.default.query(customQuery, (err, results) => {
            if (err){
                throw err
            } else if(!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results.rows)
            }
        })
    }

}