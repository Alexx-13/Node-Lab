import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
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
        readonly collectionName = 'products'
        public finalQuery 
        public checkObj
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
                if(parseInt(this.requestStr.minRating)){
                    this.minRating = parseInt(this.requestStr.minRating)
                } else {
                    response.send(HTTPStatusCodes.BAD_REQUEST)
                }
                
            } catch(err){
                throw new err
            }
        }

        getPrice(){
            try{
                let priceStr: string = this.requestStr.price
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
                            response.send(HTTPStatusCodes.BAD_REQUEST)
                        }
                    } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                        if( parseInt(priceStr.split(':')[1])){
                            minPrice = parseInt(priceStr.split(':')[1])
                            this.price = { $gte : minPrice }
                        } else {
                            response.send(HTTPStatusCodes.BAD_REQUEST)
                        }
                    } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                        if(parseInt(priceStr.split(':')[0])){
                            maxPrice = parseInt(priceStr.split(':')[0])
                            this.price = { $lte : maxPrice }
                        } else {
                            response.send(HTTPStatusCodes.BAD_REQUEST)
                        }
                    } else {
                        response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                }
            } catch(err){  
                throw new err
            }
        }

        createSortByQuery(){
            try{
                if(this.requestStr.sortBy){
                    let sortByStr: number | string = request.query.sortBy
                    let directionSortBy
    
                    if(sortByStr.split(':')[1].toLocaleLowerCase() === 'desc'){
                        directionSortBy = 1
                        this.sortBy = directionSortBy
                    } else if (sortByStr.split(':')[1].toLocaleLowerCase() === 'asc'){
                        directionSortBy = -1
                        this.sortBy = directionSortBy
                    } else {
                        response.send(HTTPStatusCodes.BAD_REQUEST)
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
                db.default.collection(this.collectionName).find(this.getFinalQuery(), { projection: { _id: 0 } }).sort(this.getSortByQuery).toArray((err, result) => {
                    if (err){
                        throw err;
                    } else if(result.length === 0){
                        response.send(HTTPStatusCodes.NOT_FOUND)
                    } else {
                        response.send(result)
                    }
                })    
            } else {
                db.default.collection(this.collectionName).find(this.getFinalQuery(), { projection: { _id: 0 } }).toArray((err, result) => {
                    if (err){
                        throw err;
                    } else if(result.length === 0){
                        response.send(HTTPStatusCodes.NOT_FOUND)
                    } else {
                        response.send(result)
                    }
                })
            }

        }
        
    }


    let queryParams = new QueryParams()
    queryParams.makeDBSearch()

}

export default productsFilter