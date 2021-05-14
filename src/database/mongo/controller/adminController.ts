import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Errors } from '../../../enum'
import { ProductsGeneralController, CategoriesGeneralController } from '../../generalController'
import { getLocalAccessToken } from '../../../service'
import { db } from '../../../app'
import { ObjectId } from 'mongodb'

interface IAdminControllerMongo {
    finalQuery: Object | undefined
    collectionName: string

    setFindQueryById()
    getFindQueryById()
    makeDBSearchById()
    makeDBPost()
    makeDBDeleteById()
    makeDBPatchById()
}

export default class AdminControllerMongo implements IAdminControllerMongo{
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public accounCollectionName = CollectionNames.account
    public collectionName
    public finalQuery

    constructor(request, response, current){
        this.request = request
        this.response = response
        this.requestStr = request.query
        this.collectionName = current
    }

    setFindQueryById(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        if(this.requestStr.id){
            if(this.collectionName === CollectionNames.products){
                const productsFinder = new ProductsGeneralController(this.request, this.response)
                this.finalQuery._id = new ObjectId(productsFinder.getProductId())
            } else if (this.collectionName === CollectionNames.categories){
                const categoriesFinder = new CategoriesGeneralController(this.request, this.response)
                this.finalQuery._id = new ObjectId(categoriesFinder.getCategoryId())
            }
        }

        return this.finalQuery
    }

    getFindQueryById(){
        return this.setFindQueryById()
    }

    makeDBSearchById(){
        db.default.collection(this.collectionName)
        .find(this.getFindQueryById())
        .toArray((err, results) => {
            if (err){
                throw err
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }

    makeDBPost(){
        db.default.collection(this.collectionName)
        .insertOne(this.requestStr)
        .toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                this.response.send(HTTPStatusCodes.OK)
            }
        }) 
    }

    makeDBDeleteById(){
        db.default.collection(this.collectionName)
        .deleteOne(this.getFindQueryById())
        .toArray((err, results) => {
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
        db.default.collection(this.collectionName)
        .find(this.getFindQueryById())
        .toArray((err, results) => {
            if (err){
                throw err
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                db.default.collection(this.collectionName)
                .update(this.requestStr)
                .toArray((err, results) => {
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
