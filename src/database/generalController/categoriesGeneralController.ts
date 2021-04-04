import { ObjectId } from 'mongodb'
import { HTTPStatusCodes, CollectionNames } from '../../enum'

interface ICategoriesGeneralController {
    getCategoryId()
    getDisplayName()
    getIncludeProducts()
    getIncludeTop3Products()
}

export default class CategoriesGeneralController implements ICategoriesGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.categories
    requestStr!: { [queryParam: string]: string} 
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    getCategoryId(){
        try {
            return new ObjectId(this.requestStr.id)
        } catch (err) {
            throw new err
        }
    }

    getDisplayName(){
        try {
            return this.requestStr.displayName
        } catch (err) {
            throw new err
        }
    }

    getIncludeProducts(){
        try {
            if(this.requestStr.includeProducts){
                if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                    return true
                } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                    return false
                } else {
                    this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
                }
            }
        } catch (err) {
            throw new err
        }
    }

    getIncludeTop3Products(){
        try {
            if(this.requestStr.includeTop3Products){
                if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                    return 3
                } else {
                    this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
                } 
            }
        } catch (err) {
            throw new err
        }
    }
}