import { ObjectId } from 'mongodb'
import { HTTPStatusCodes, CollectionNames } from '../../enum'

interface ICategoriesGeneralController {
    collectionName: string
    requestStr: object

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
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getDisplayName(){
        try {
            return this.requestStr.displayName
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getIncludeProducts(){
        try {
            if(this.requestStr.includeProducts.toLocaleLowerCase() === 'true'){
                return true
            } else if(this.requestStr.includeProducts.toLocaleLowerCase() === 'false'){
                return false
            }
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getIncludeTop3Products(){
        try {
            if(this.requestStr.includeTop3Products.toLocaleLowerCase() === 'top'){
                return 3
            }
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}