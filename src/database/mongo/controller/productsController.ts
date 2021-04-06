/* eslint-disable @typescript-eslint/ban-types */
import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames } from '../../../enum'
import { db, io } from '../../../app'
import { ProductsGeneralController } from '../../generalController'

interface IProductsControllerMongo {
    request: Request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    collectionNameRatings?: string
    finalQuery: Object | undefined
    sortQuery: Object | undefined
}

export default class ProductsControllerMongo implements IProductsControllerMongo {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = CollectionNames.products
    public collectionNameRatings = CollectionNames.ratings
    public finalQuery
    public sortQuery
    public userRating: number | undefined

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }

    setRatingsQuery(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        const productsFinder = new ProductsGeneralController(this.request, this.response)

        if(this.requestStr.id && this.requestStr.rate){
            this.finalQuery._id = productsFinder.getProductId()
            this.finalQuery.ratings = productsFinder.getRatings()
        }

        return this.finalQuery
    }

    getRatingsQuery(){
        return this.setRatingsQuery()
    }

    setFindQuery(){
        this.finalQuery = new Object()
        let productsFinder = new ProductsGeneralController(this.request, this.response)

        if(this.requestStr.displayName){
            this.finalQuery.displayName = productsFinder.getDisplayName()
        }

        if(this.requestStr.minRating){
            this.finalQuery.totalRating = { $gt: productsFinder.getMinRating() }
        }

        if(this.requestStr.price){
            this.finalQuery.price = productsFinder.getPrice()
        }

        return this.finalQuery
    }

    getFindQuery(){
        return this.setFindQuery()
    }

    setSortQuery(){
        let productsFinder = new ProductsGeneralController(this.request, this.response)

        if(this.requestStr.sortBy){
            return this.sortQuery = productsFinder.getSortQuery()
        }
    }

    getSortQuery(){
        return this.setSortQuery()
    }

    makeDBSearch(){
        if(this.requestStr.id && this.requestStr.rate){
            this.getRatingsQuery()

            db.default.collection(this.collectionName).updateOne(
                {_id: this.finalQuery._id},
                { $push: { ratings: this.finalQuery.ratings } }
            )

            db.default.collection(this.collectionName).find({ _id: this.finalQuery._id} )
            .toArray((err, results) => {
                if (err){
                    throw err;
                } else if(results.length === 0){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    const ratingsSum = results[0].ratings.reduce((a, b) => a + b)
                    const oldData = { totalRating: results[0].totalRating }
                    const newData = { $set: { totalRating: ratingsSum } }

                    db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
                        if (err){
                            throw err;
                        } else if(results.length === 0){
                            this.response.send(HTTPStatusCodes.NOT_FOUND)
                        } else {
                            this.response.send(HTTPStatusCodes.OK)
                        }
                    })
                }
            })
        }

        db.default.collection(this.collectionName).find(this.getFindQuery(), { projection: { _id: 0 } }).sort(this.getSortQuery()).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                return this.response.send(results)
            }
        })    
    }
}
