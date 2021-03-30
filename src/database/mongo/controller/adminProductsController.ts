import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../enum'
import { db } from '../../../app'

interface IAdminControllerMongo {
    getProductId()
    getSearchByIdQuery()
    makeDBSearchById()
    makeDBPost()
    getDeleteByIdQuery()
    makeDBDeleteById()
    getDBPatchByIdQuery()
    makeDBPathcById()
}

export default class AdminControllerMongo implements IAdminControllerMongo{
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'products'
    public productId: string | undefined

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }

    getProductId(){
        try{
            this.productId = this.request.params.id
        } catch(err){
            throw new err
        }
    }

    getSearchByIdQuery(){
        try{
            return { _id: this.getProductId() }
        } catch(err){
            throw new err
        }
    }

    makeDBSearchById(){
        db.default.collection(this.collectionName).find(this.getSearchByIdQuery()).toArray((err, results) => {
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

    getDeleteByIdQuery(){
        try{
            return { _id: this.getProductId() }
        } catch(err){
            throw new err
        }
    }

    makeDBDeleteById(){
        db.default.collection(this.collectionName).deleteOne(this.getSearchByIdQuery()).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                this.response.send(results)
            }
        })    
    }
    
    getDBPatchByIdQuery(){
        try{
            return { _id: this.getProductId(), $set: this.requestStr }
        } catch(err){
            throw new err
        }
    }

    makeDBPathcById(){
        db.default.collection(this.collectionName).update(this.getDBPatchByIdQuery()).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            } else {
                this.response.send(results)
            }
        }) 
    }

}
