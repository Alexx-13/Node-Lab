import { Request, Response } from 'express'
import db from '../../../app'

interface ICategoriesFilterPostgres {
    request: Request
    response: Response
    id: number
    includeProducts?: boolean
    includeTop3Products?: string
    requestStr: { [queryParam: string]: string }
    collectionName: string
}

export default class CategoriesFilterPostgres implements ICategoriesFilterPostgres {
    readonly request: Request
    readonly response: Response
    public id
    public includeProducts
    public includeTop3Products
    public finalQuery: string = `SELECT * FROM categories`
    public requestStr: { [queryParam: string]: string }
    public collectionName: string = 'categories'

      
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
            }
        } catch(err){
            throw new err
        }
    }

    getIncludeTop3Products(){
        try{
            if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                this.includeTop3Products = 3
            }
        } catch(err){
            throw new err
        }
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

        db.default.query(this.getFinalQuery(), (error, results) => {
            if (error) throw error
            return this.response.send(results.rows)
        })
    }
}