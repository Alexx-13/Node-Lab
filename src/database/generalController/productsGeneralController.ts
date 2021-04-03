import { CollectionNames, HTTPStatusCodes } from '../../enum'

interface IProductsGeneralController {
    getUserId()
    getDisplayName()
    getCategoriesIDs()
    getCreatedAt()
    getMinRating()
    getPrice()
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

    getUserId(){
        try {
            return this.requestStr._id
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

    getMinRating(){
        try {
            return parseInt(this.requestStr.minRating)
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getPrice(){
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

    getSortQuery(){
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
            throw new err
        }
    }
}