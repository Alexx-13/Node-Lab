import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
import db from '../../../app'

interface IProductsControllerPostgres {
    request: Request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    paginationCondition: string
    customIndex: string
    finalQuery: string
    dipslayName: string
    minRating?: number
    price?: string
    sortBy?: string
}

export default class ProductsControllerPostgres implements IProductsControllerPostgres {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'products'
    readonly paginationCondition: string = `AND id > 20 LIMIT 20`
    readonly customIndex = `CREATE INDEX idx_displayName on products(displayName)`
    public finalQuery = `SELECT * FROM products`
    public dipslayName
    public minRating
    public price
    public sortBy

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
            const priceStr = this.requestStr.price
            let priceArr: Array<string> | Array<number> | undefined 

            let minPrice
            let maxPrice

            if(priceStr){
                priceArr = priceStr.split('')
                
                if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
                    if(parseInt(priceStr.split(':')[0]) && parseInt(priceStr.split(':')[1])){
                        minPrice = priceStr.split(':')[0]
                        maxPrice = priceStr.split(':')[1]
                        this.price = `price <= ${maxPrice} AND price >= ${minPrice}`
                    } else {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                    if(parseInt(priceStr.split(':')[1])){
                        minPrice = priceStr.split(':')[1]
                        this.price = `price >= ${minPrice}`
                    } else {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                    if(parseInt(priceStr.split(':')[0])){
                        maxPrice = priceStr.split(':')[0]
                        this.price = `price <= ${maxPrice}`
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

    getSortBy(){
        try{
            const sortByStr: number | string = this.request.query.sortBy
            const queryField = sortByStr.split(':')[0]
            const querySortBy = sortByStr.split(':')[1].toLocaleLowerCase()

            if(querySortBy === 'desc'){
                this.sortBy = `ORDER BY ${queryField} DESC`
            } else if (querySortBy === 'asc'){
                this.sortBy = `ORDER BY ${queryField} ASC`
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){
            throw new err
        }
    }

    createFinalQuery(){
        this.getDisplayName()
        if(this.requestStr.displayName){
            this.finalQuery = `${this.finalQuery} WHERE displayName = ${this.dipslayName}`

            if(this.requestStr.minRating){
                this.getMinRating()
                this.finalQuery = `${this.finalQuery} AND minRating = ${this.minRating}`
            }

            if(this.requestStr.price){
                this.getPrice()
                this.finalQuery = `${this.finalQuery} AND ${this.price}`
            }

            if(this.requestStr.sortBy){
                this.getSortBy()
                this.finalQuery = `${this.finalQuery} ${this.sortBy}`
            }
        }
    }

    makeDBSearch(){
        this.createFinalQuery()

        db.default.query(this.getFinalQuery(), (err, results) => {
            if (err){
                throw err
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results.rows)
            }
        })
    }

    getFinalQuery(){
        return this.customIndex + this.finalQuery
    }

}