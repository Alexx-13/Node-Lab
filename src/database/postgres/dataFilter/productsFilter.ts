import { Request, Response } from 'express'
import db from '../../../app'

const dataFilter = async (request: Request, response: Response) => {
    interface IQueryParams {
        finalQuery: string
        dipslayName: string
        minRating?: number
        price?: string
        sortBy?: string
    }

    class QueryParams implements IQueryParams {
        readonly requestStr = request.query
        readonly paginationCondition: string = `AND id > 20 LIMIT 20`
        readonly customIndex = `CREATE INDEX idx_displayName on products(displayName)`

        public finalQuery: string = `SELECT * FROM products`
        public dipslayName
        public minRating
        public price
        public sortBy

        getDisplayName(){
           try{
                this.dipslayName = this.requestStr.displayName
           } catch(err){
               throw new err
           }
        }

        getMinRating(){
            try{
                this.minRating = this.requestStr.minRating
            } catch(err){
                throw new err
            }
        }

        getPrice(){
            try{
                let priceStr = this.requestStr.price
                let priceArr: Array<string> | Array<number> | undefined 

                let minPrice
                let maxPrice

                if(priceStr !== undefined){
                    priceArr = priceStr.split('')
                    if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
                        minPrice = priceStr.split(':')[0]
                        maxPrice = priceStr.split(':')[1]
                        this.price = `price <= ${maxPrice} AND price >= ${minPrice}`
                    } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                        minPrice = priceStr.split(':')[1]
                        this.price = `price >= ${minPrice}`
                    } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                        maxPrice = priceStr.split(':')[0]
                        this.price = `price <= ${maxPrice}`
                    } else {
                        minPrice = undefined
                        maxPrice = undefined
                    }
                }
            } catch(err){
                throw new err
            }
                
        }

        getSortBy(){
            try{
                let sortByStr: number | string = request.query.sortBy
                let queryField = sortByStr.split(':')[0]
                let querySortBy = sortByStr.split(':')[1].toLocaleLowerCase()

                if(querySortBy === 'desc'){
                    this.sortBy = `ORDER BY ${queryField} DESC`
                } else if (querySortBy === 'asc'){
                    this.sortBy = `ORDER BY ${queryField} ASC`
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

        getFinalQuery(){
            return this.customIndex + this.finalQuery
        }

        makeDBSearch(){
            this.createFinalQuery()

            db.default.query(this.getFinalQuery(), (error, results) => {
                if (error) throw error
                return response.send(results.rows)
            })
        }
    }

    let queryParams = new QueryParams()
    queryParams.makeDBSearch()
    
}

export default dataFilter