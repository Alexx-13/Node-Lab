import { Request, Response } from 'express'
// import { ProductsModel } from '../models'
import db from '../../../app'

const productsFilter = async (request: Request, response: Response): Promise<any> => {
    /* Schemas creation snippets */
    // const dataA = await ProductsModel.create({ 
    //     displayName: 'Game1',
    //     categoryIds: 'id1',
    //     createdAt: new Date(),
    //     minRating: 1,
    //     price: 100
    // })
    // const dataB = await ProductsModel.create({ 
    //     displayName: 'Game2',
    //     categoryIds: 'id2',
    //     createdAt: new Date(),
    //     minRating: 2,
    //     price: 200
    // })
    // response.send(dataA)
    // response.send(dataB)

    interface IQueryParams {
        finalQuery: object
        dipslayName: string
        minRating?: object
        price?: string
        sortBy?: string
    }


    class QueryParams implements IQueryParams {
        readonly requestStr = request.query

        public finalQuery 
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
                this.minRating = parseInt(this.requestStr.minRating)
            } catch(err){
                throw new err
            }
        }

        getPrice(){
            try{
                let priceStr: string | number = this.requestStr.price
                let priceArr: Array<string> | Array<number> | undefined

                let minPrice
                let maxPrice
        
                if(priceStr !== undefined){
                    priceArr = priceStr.split('')
                    if( priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':' ){
                        minPrice = parseInt(priceStr.split(':')[0])
                        maxPrice = parseInt(priceStr.split(':')[1])
                        this.price = { $gte : minPrice, $lte : maxPrice } 
                    } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                        minPrice = parseInt(priceStr.split(':')[1])
                        this.price = { $gte : minPrice }
                    } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                        maxPrice = parseInt(priceStr.split(':')[0])
                        this.price = { $lte : maxPrice }
                    } else {
                        minPrice = undefined
                        maxPrice = undefined
                    }
                }
            } catch(err){  
                throw new err
            }
        }

        createSortByQuery(){
            try{
                if(this.requestStr.displayName && this.requestStr.sortBy){
                    let sortByStr: number | string = request.query.sortBy
                    let directionSortBy
    
                    if(sortByStr.split(':')[1].toLocaleLowerCase() === 'desc'){
                        directionSortBy = 1
                        this.sortBy = directionSortBy
                    } else if (sortByStr.split(':')[1].toLocaleLowerCase() === 'asc'){
                        directionSortBy = -1
                        this.sortBy = directionSortBy
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
    }



    let queryParams = new QueryParams()

    queryParams.createFinalQuery()
    queryParams.createSortByQuery()

    if(queryParams.getSortByQuery()){
        db.default.collection('products').find(queryParams.getFinalQuery(), { projection: { _id: 0 } }).sort(queryParams.getSortByQuery()).toArray((err, result) => {
            if (err) throw err;
            console.log(result)
            return result
        })    
    } else {
        db.default.collection('products').find(queryParams.getFinalQuery(), { projection: { _id: 0 } }).toArray((err, result) => {
            if (err) throw err;
            return result
        })
    }


}

export default productsFilter