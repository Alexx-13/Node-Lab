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

    setRatingsQuery()
    getRatingsQuery()
    setFindQuery()
    getFindQuery()
    setSortQuery()
    getSortQuery()
    makeDBSearch()
}

export default class ProductsControllerMongo implements IProductsControllerMongo {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = CollectionNames.products
    public collectionNameRatings = CollectionNames.ratings
    public finalQuery
    public sortQuery

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
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

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
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

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

            db.default.collection(this.collectionName)
            .updateOne( // get document by id and push rating value into ratings array
                {_id: this.finalQuery._id},
                { $push: { ratings: this.finalQuery.ratings } },
                ((err, results) => {
                    if (err){
                        throw err;
                    } else if(results.length === 0){
                        this.response.send(HTTPStatusCodes.NOT_FOUND)
                    } else {

                        io.sockets.on('connection', (socket) => { // ALEX асинхронность
                            console.log('WebScoket in products controller connected!');
                            
                            socket.emit('rating', results)
                            
                            socket.on('disconnect', () => {
                                console.log('WebScoket in products controller disconnected!')
                            })
                        })

                        db.default.collection(this.collectionNameRatings)
                        .find()
                        .toArray((err, results) => { // get lastRatings document
                            if (err){
                                throw err;
                            } else if(results.length === 0){
                                this.response.send(HTTPStatusCodes.NOT_FOUND)
                            } else {
                                const currentRatingsDocument = results[0]
                                
                                db.default.collection(this.collectionNameRatings)
                                .updateOne( // get lastRatings document by id and push rating value into ratings array
                                    { _id: currentRatingsDocument._id },
                                    { $push: { ratings: this.finalQuery.ratings } } // ALEX асинхронность нужна
                                )
                            }
                        })

                    }
                })
            )

            db.default.collection(this.collectionName)
            .find({ _id: this.finalQuery._id} ) // get document by id
            .toArray((err, results) => {
                if (err){
                    throw err;
                } else if(results.length === 0){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    const currentProductDocument = results[0]
                    const ratingsSum = currentProductDocument.ratings.reduce((a, b) => a + b)

                    db.default.collection(this.collectionName)
                    .updateOne( // update documents totalRating with sum of ratings
                        { _id: currentProductDocument._id},
                        { $set: { totalRating: ratingsSum } }
                    )
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
