import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
import db from '../../../app'

interface IProductsFilterMongo {
    request: Request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery
    dipslayName?: string | object | undefined
    minRating?: number | object | undefined
    price?: string | object | undefined
    sortBy?: string | undefined
}

export default class ProductsFilterMongo implements IProductsFilterMongo {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'products'
    public finalQuery
    public dipslayName: string | object | undefined
    public minRating: number | object |  undefined
    public price: string | object | undefined
    public sortBy: string | undefined

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }

    getDisplayName(){
        try{
            this.dipslayName = this.requestStr.displayName
        } catch(err){
            throw new err
        }
    }

    getMinRating(){
        try{
            if(parseInt(this.requestStr.minRating)){
                this.minRating = parseInt(this.requestStr.minRating)
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
            
        } catch(err){
            throw new err
        }
    }

    getPrice(){
        try{
            const priceStr: string = this.requestStr.price
            let priceArr: Array<string> | Array<number> | undefined

            let minPrice
            let maxPrice
    
            if(priceStr){
                priceArr = priceStr.split('')
                if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
                    if(parseInt(priceStr.split(':')[0]) && parseInt(priceStr.split(':')[1])){
                        minPrice = parseInt(priceStr.split(':')[0])
                        maxPrice = parseInt(priceStr.split(':')[1])
                        this.price = { $gte : minPrice, $lte : maxPrice } 
                    } else {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                    if( parseInt(priceStr.split(':')[1])){
                        minPrice = parseInt(priceStr.split(':')[1])
                        this.price = { $gte : minPrice }
                    } else {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                    if(parseInt(priceStr.split(':')[0])){
                        maxPrice = parseInt(priceStr.split(':')[0])
                        this.price = { $lte : maxPrice }
                    } else {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            }
        } catch(err){  
            throw new err
        }
    }

    createSortByQuery(){
        try{
            if(this.requestStr.sortBy){
                const sortByStr: number | string = this.request.query.sortBy
                let directionSortBy

                if(sortByStr.split(':')[1].toLocaleLowerCase() === 'desc'){
                    directionSortBy = 1
                    this.sortBy = directionSortBy
                } else if (sortByStr.split(':')[1].toLocaleLowerCase() === 'asc'){
                    directionSortBy = -1
                    this.sortBy = directionSortBy
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            }
        } catch(err){  
            throw new err
        }
    } 

    getSortByQuery(){
        return this.sortBy
    }

    createFinalQuery(){
        this.finalQuery = new Object()

        if(this.requestStr.displayName){
            this.getDisplayName()
            this.finalQuery.displayName = this.dipslayName

            if(this.requestStr.minRating){
                this.getMinRating()
                this.finalQuery.minRating = { $gt: this.minRating }
            }

            if(this.requestStr.price){
                this.getPrice()
                this.finalQuery.price = this.price
            }
        }
    }

    getFinalQuery(){
        return this.finalQuery
    }

    makeDBSearch(){
        this.createFinalQuery()
        this.createSortByQuery()

        if(this.getSortByQuery()){
            db.default.collection(this.collectionName).find(this.getFinalQuery(), { projection: { _id: 0 } }).sort(this.getSortByQuery).toArray((err, results) => {
                if (err){
                    throw err;
                } else if(results.length === 0){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    this.response.send(results)
                }
            })    
        } else {
            db.default.collection(this.collectionName).find(this.getFinalQuery(), { projection: { _id: 0 } }).toArray((err, results) => {
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
}
