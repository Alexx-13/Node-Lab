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
    finalQuery
    sortQuery
    minRating?: number | object | undefined
    price?: string | object | undefined
    sortBy?: string | undefined
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
    public minRating: number | object |  undefined
    public price: string | object | undefined
    public sortBy: string | undefined

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }

    getUserRating(){
        try{
            const rating = parseInt(this.request.params.value)

            if(rating <= 10 && rating >= 1){
                this.userRating = rating
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){
            throw new err
        }
    }

    getUserRatingQuery(){
        try{
          return { totalRating: this.getUserRating() }
        } catch(err){
            throw new err
        }
    }

    makeDBRatingUpdate(){
        db.default.collection(this.collectionName).find(this.getUserRatingQuery()).toArray((err, results) => {
            if (err){
                throw err
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                const oldData = { totalRating:  results[0].totalRating }
                const newData = { $set: this.getUserRatingQuery() }

                db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
                    if (err) {
                        throw new err
                    } else {
                        this.response.send(HTTPStatusCodes.OK)
                        io.sockets.on('connection', (socket) => {
                            console.log('WebScoket in products controller connected!');
                          
                            socket.emit('rating', results)
                          
                            socket.on('disconnect', () => {
                              console.log('WebScoket in products controller disconnected!')
                            })
                        })

                        db.default.collection(this.collectionNameRatings).insertOne(results, (err, results) => {
                            if (err) {
                                throw new err
                            } else {
                                this.response.send(HTTPStatusCodes.OK)
                            }
                        })
                    }
                })
            }
        })
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
        db.default.collection(this.collectionName).find(this.getFindQuery(), { projection: { _id: 0 } }).sort(this.getSortQuery()).toArray((err, results) => {
            if (err){
                throw err;
            } else if(results.length === 0){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }
}
