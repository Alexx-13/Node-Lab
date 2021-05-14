import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Errors } from '../../../enum'
import { ProductsGeneralController, CategoriesGeneralController } from '../../generalController'
import { getLocalAccessToken } from '../../../service'
import { db } from '../../../app'

interface IAdminControllerMongo {
    finalQuery: Object | undefined
    collectionName: string

    setFindQuery()
    makeDBSearchById()
    makeDBPost()
    makeDBDeleteById()
    makeDBPatchById()
}

export default class AdminControllerPostgres implements IAdminControllerMongo {
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
    
    setFindQuery(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        if(this.requestStr.id){
            if(this.collectionName === CollectionNames.products){
                const productsFinder = new ProductsGeneralController(this.request, this.response)
                this.finalQuery._id = productsFinder.getProductId()
            } else if (this.collectionName === CollectionNames.categories){
                const categoriesFinder = new CategoriesGeneralController(this.request, this.response)
                this.finalQuery._id = categoriesFinder.getCategoryId()
            }
        }

        if(this.requestStr.id && this.requestStr.displayName){
            if(this.collectionName === CollectionNames.products){
                const productsFinder = new ProductsGeneralController(this.request, this.response)
                this.finalQuery._id = productsFinder.getProductId()
                this.finalQuery.displayName = productsFinder.getDisplayName()
            } else if (this.collectionName === CollectionNames.categories){
                const categoriesFinder = new CategoriesGeneralController(this.request, this.response)
                this.finalQuery._id = categoriesFinder.getCategoryId()
                this.finalQuery.displayName = categoriesFinder.getDisplayName()
            }
        }

        return this.finalQuery
    }

    makeDBSearchById(){
        this.setFindQuery()
        const customQuery = `SELECT * FROM ${this.collectionName} WHERE id = ${this.finalQuery._id}`

        db.default.query(customQuery, (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }

    makeDBPost(){
        this.setFindQuery()
        const customQuery = `INSERT INTO ${this.collectionName} (displayName) VALUES (${this.finalQuery.displayName})`

        db.default.query(customQuery, (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })
    }

    makeDBDeleteById(){
        this.setFindQuery()
        const customQuery = `DELETE FROM ${this.collectionName} WHERE id = ${this.finalQuery._id}`

        db.default.query(customQuery, (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        }) 

    }

    makeDBPatchById(){
        this.setFindQuery()
        const customQuery = `UPDATE ${this.collectionName} SET ${this.finalQuery}`

        db.default.query(customQuery, (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })
    }
}
