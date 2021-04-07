import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Errors } from '../../../enum'
import { ProductsGeneralController } from '../../generalController'
import { getLocalAccessToken } from '../../../service'
import { db } from '../../../app'
import { ObjectId } from 'mongodb'

interface IAdminControllerMongo {
    finalQuery: Object | undefined
    isAdminRole: boolean
    collectionName: string

    getAccountRole()
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
    public isAdminRole

    constructor(request, response, current){
        this.request = request
        this.response = response
        this.requestStr = request.query
        this.collectionName = current
    }

    getAccountRole(){
        db.default.collection(this.accounCollectionName)
        .find({ accessToken: getLocalAccessToken() })
        .toArray((err, results) => {
            if(err){
                throw err
            } else if(results.length === 0){
                this.isAdminRole = false
            } else {
                this.isAdminRole = true
            }
        })
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
        this.getAccountRole()

        if(this.isAdminRole){
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
        } else {
            this.response.send(Errors.falseAdmin)
        }
    }

    makeDBPost(){
        this.getAccountRole()

        if(this.isAdminRole){
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
        } else {
            this.response.send(Errors.falseAdmin)
        }
    }

    makeDBDeleteById(){
        this.getAccountRole()

        if(this.isAdminRole){
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
        } else {
             this.response.send(Errors.falseAdmin)
        }
    }

    makeDBPatchById(){
        this.getAccountRole()

        if(this.isAdminRole){
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
        } else {
            this.response.send(Errors.falseAdmin)
        }
    }
}
