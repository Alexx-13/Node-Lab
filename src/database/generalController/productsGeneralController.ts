import { CollectionNames, HTTPStatusCodes } from '../../enum'
import { ObjectId } from 'mongodb'

interface IProductsGeneralController {
    collectionName: string
    requestStr: object

    getProductId()
    getDisplayName()
    getCategoriesIDs()
    getCreatedAt()
    getRatings()
    getAllRatings()
    getMinRating()
    getPriceMongo()
    getPricePostgres()
    getSortQueryMongo()
    getSortQueryPostgres()
}

export default class ProductsGeneralController implements IProductsGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.products
    requestStr!: { [queryParam: string]: string} 
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    getProductId(){
        try {
            return new ObjectId(this.requestStr.id)
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getDisplayName(){
        try {
            return this.requestStr.displayName

        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getCategoriesIDs(){
        try {
            return this.requestStr.categoryIds
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getCreatedAt(){
        try {
            return this.requestStr.createdAt
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getRatings(){
        try {
            if(parseInt(this.requestStr.rate) <= 10 && parseInt(this.requestStr.rate) >= 1){
                return parseInt(this.requestStr.rate)
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getAllRatings(){
        try {
            if(parseInt(this.requestStr.rate) <= 10 && parseInt(this.requestStr.rate) >= 1){
                return parseInt(this.requestStr.rate)
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getMinRating(){
        try {
            return parseInt(this.requestStr.minRating)
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getPriceMongo(){
        try{
            const priceStr: string = this.requestStr.price
            let priceArr: Array<string> | Array<number> | undefined = priceStr.split('')

            let minPrice
            let maxPrice
    
            if(priceArr.includes(':') && priceArr[0] !== ':' && priceArr[priceArr.length - 1] !== ':'){
                if(parseInt(priceStr.split(':')[0]) && parseInt(priceStr.split(':')[1])){
                    minPrice = parseInt(priceStr.split(':')[0])
                    maxPrice = parseInt(priceStr.split(':')[1])
                    return { $gte : minPrice, $lte : maxPrice } 
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            } else if (priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0'){
                if(parseInt(priceStr.split(':')[1])){
                    minPrice = parseInt(priceStr.split(':')[1])
                    return { $gte : minPrice }
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            } else if (parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':'){
                if(parseInt(priceStr.split(':')[0])){
                    maxPrice = parseInt(priceStr.split(':')[0])
                    return { $lte : maxPrice }
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){  
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getPricePostgres(){
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
                    return `price <= ${maxPrice} AND price >= ${minPrice}`
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            } else if ( priceArr[0] === ':' && parseInt(priceArr[priceArr.length - 1]) || priceArr[priceArr.length - 1] === '0' ){
                if(parseInt(priceStr.split(':')[1])){
                    minPrice = priceStr.split(':')[1]
                    return  `price >= ${minPrice}`
                } else {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                }
            } else if ( parseInt(priceArr[0]) && priceArr[priceArr.length - 1] === ':' ){
                if(parseInt(priceStr.split(':')[0])){
                    maxPrice = priceStr.split(':')[0]
                    return `price <= ${maxPrice}`
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

    getSortQueryMongo(){
        try {
            const sortByStr: number | string = this.requestStr.sortBy
            let sortQuery
            let fieldSortBy = sortByStr.split(':')[0]
            let directionSortBy

            if(sortByStr.split(':')[1].toLocaleLowerCase() === 'desc'){
                directionSortBy = 1
                return sortQuery = {
                    [fieldSortBy]: directionSortBy
                }
            } else if (sortByStr.split(':')[1].toLocaleLowerCase() === 'asc'){
                directionSortBy = -1
                return sortQuery = {
                    [fieldSortBy]: directionSortBy
                }
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){  
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getSortQueryPostgres(){
        try{
            const sortByStr: number | string = this.requestStr.sortBy
            const queryField = sortByStr.split(':')[0]
            const querySortBy = sortByStr.split(':')[1].toLocaleLowerCase()

            if(querySortBy === 'desc'){
                return  `ORDER BY ${queryField} DESC`
            } else if (querySortBy === 'asc'){
                return `ORDER BY ${queryField} ASC`
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
            }
        } catch(err){
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}