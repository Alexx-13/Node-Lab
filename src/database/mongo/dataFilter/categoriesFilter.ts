import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
import db from '../../../app'

interface ICategoriesFilterMongo {
    request: Request
    response: Response
    includeProducts?: boolean | undefined
    includeTop3Products?: number | undefined
    requestStr: { [queryParam: string]: string }
    collectionName: string
}

export default class CategoriesFilterMongo implements ICategoriesFilterMongo {
    readonly request: Request
    readonly response: Response
    public includeProducts: boolean | undefined
    public includeTop3Products: number | undefined
    public requestStr: { [queryParam: string]: string }
    public collectionName: string = 'categories'
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }       

    getIncludeProducts(){
        try {
            if(this.requestStr.includeProducts){
                if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                    this.includeProducts = true
                } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                    this.includeProducts = false
                } else {
                    this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
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
                    this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
                } 
            }
        } catch (err) {
            throw new err
        }
    }

    makeDBSearch(){
        if(Object.keys(this.requestStr).length === 0){
            db.default.collection(this.collectionName).find({}).toArray((err, results) => {
                if (err) throw err
                return this.response.send(JSON.stringify(results))
            })
        } else {
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
                    ]).toArray((err, results) => {
                        if (err){
                            throw err
                        } else if(results.length === 0){
                            this.response.send(HTTPStatusCodes.NOT_FOUND);
                        } else {
                            return this.response.send(JSON.stringify(results))
                        }
                    })
                } else if(this.includeProducts === undefined){
                    db.default.collection(this.collectionName).find({}).toArray((err, results) => {
                        if (err){
                            throw err
                        } else if(results.length === 0){
                            this.response.send(HTTPStatusCodes.NOT_FOUND);
                        } else {
                            return this.response.send(JSON.stringify(results))
                        }
                    })
                }
            }
        }
    }
}
