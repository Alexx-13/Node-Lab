import { Request, Response } from 'express'
import { HTTPStatusCodes, CollectionNames } from '../../../enum'
import { db, io } from '../../../app'
import { ProductsGeneralController } from '../../generalController'

interface IProductsControllerPostgres {
    request: Request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    collectionNameRatings?: string
    customIndex: string
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

export default class ProductsControllerPostgres implements IProductsControllerPostgres {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = CollectionNames.products
    public collectionNameRatings = CollectionNames.ratings
    readonly customIndex = `CREATE INDEX idx_displayName on products(displayName)`
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
            this.finalQuery.totalRating = `totalRating > ${productsFinder.getMinRating()}`
        }

        if(this.requestStr.price){
            this.finalQuery.price = productsFinder.getPricePostgres()
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
            return this.sortQuery = productsFinder.getSortQueryPostgres()
        }
    }

    getSortQuery(){
        return this.setSortQuery()
    }

    makeDBSearch(){
        if(this.requestStr.id && this.requestStr.rate){
            this.getFindQuery()
            let ratingsSum
            db.default.query(
                `INSERT INTO ${this.collectionName} 
                (totalRating)
                VALUES 
                (${this.finalQuery.ratings})
                ${this.getSortQuery()}
                `, 
                (err, results) => {
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

                        db.default.query(
                            `INSERT INTO ${this.collectionNameRatings}
                            (rating)
                            VALUES
                            (${this.collectionName})
                            `,
                            (err, results) => {
                                if (err) {
                                    throw new err
                                } else {
                                    this.response.send(HTTPStatusCodes.OK)
                                }
                            }
                        )

                        ratingsSum = results.ratings.reduce((a, b) => a + b)
                    }
            })

            db.default.query(
                `SELECT ratings FROM ${this.collectionNameRatings}`
            )
        }
    }
}