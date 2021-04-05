import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames } from '../../../enum'
import { ProductsGeneralController } from '../../generalController'
import { db } from '../../../app'
import { ObjectId } from 'mongodb'

interface IAdminControllerMongo {
    finalQuery: Object | undefined
}

export default class AdminControllerMongo implements IAdminControllerMongo{
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = CollectionNames.categories
    public categoriesId: string | undefined
    public finalQuery

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }

    setFindQueryById(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }
        const productsFinder = new ProductsGeneralController(this.request, this.response)

        if(this.requestStr.id){
            this.finalQuery._id = new ObjectId(productsFinder.getProductId())
        }

        return this.finalQuery
    }

    getFindQueryById(){
        return this.setFindQueryById()
    }

    makeDBSearchById(){
        db.default.collection(this.collectionName).find(this.getFindQueryById()).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }

    makeDBPost(){
        db.default.collection(this.collectionName).insertOne(this.requestStr).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                this.response.send(results)
            }
        }) 
    }

    makeDBDeleteById(){
        db.default.collection(this.collectionName).deleteOne(this.getFindQueryById()).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                this.response.send(HTTPStatusCodes.OK)
            }
        })    
    }

    makeDBPatchById(){
        db.default.collection(this.collectionName).find(this.getFindQueryById()).toArray((err, results) => {
            if (err){
                throw err
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                db.default.collection(this.collectionName).update(this.requestStr).toArray((err, results) => {
                    if (err){
                        throw err
                    } else if(results.length === 0){
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    } else {
                        this.response.send(results)
                    }
                })
            }
        }) 
    }

}
