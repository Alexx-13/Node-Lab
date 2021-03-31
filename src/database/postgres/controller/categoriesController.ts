import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../enum'
import db from '../../../app'

interface ICategoriesControllerPostgres {
    request: Request
    response: Response
    id: number
    includeProducts?: boolean
    includeTop3Products?: string
    requestStr: { [queryParam: string]: string }
    collectionName: string
}

export default class CategoriesControllerPostgres implements ICategoriesControllerPostgres {
    readonly request: Request
    readonly response: Response
    public id
    public includeProducts
    public includeTop3Products
    public finalQuery = `SELECT * FROM categories`
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'categories'

      
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }      


    getId(){
        try{
            this.id = this.requestStr.id
        } catch(err){
            throw new err
        }
    }

    getIncludeProducts(){
        try{
            if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                this.includeProducts = true
            } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                this.includeProducts = false
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){
            throw new err
        }
    }

    getIncludeTop3Products(){
        try{
            if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                this.includeTop3Products = 3
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){
            throw new err
        }
    } catch(err){
        throw new err
    }

    createFinalQuery(){
        this.getIncludeProducts()
        this.getIncludeTop3Products()
        
        if(this.includeProducts, this.includeTop3Products){
            this.finalQuery = `${this.finalQuery} INNER JOIN products ON ${this.collectionName}.displayName = products.displayName`
        }
    }

    getFinalQuery(){
        return this.finalQuery
    }

    makeDBSearch(){
        this.createFinalQuery()

        db.default.query(this.getFinalQuery(), (err, results) => {
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