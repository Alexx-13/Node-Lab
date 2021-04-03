import { CollectionNames } from '../../enum'

interface ICategoriesGeneralController {
    getUserId()
    getDisplayName()
}

export default class CategoriesGeneralController implements ICategoriesGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.categories
    requestStr!: { [queryParam: string]: string} 
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    getUserId(){
        try {
            return this.requestStr._id
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
}