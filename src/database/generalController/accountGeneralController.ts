import { CollectionNames } from '../../enum'

interface IAccountGeneralController {
    getUserId()
    getUserName()
    getUserFirstName()
    getUserLastName()
    getUserPassword()
    getAccessToken()
    getRefreshToken()
}

export default class AccountGeneralController implements IAccountGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.account
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

    getUserName(){
        try {
            return this.requestStr.userName
        } catch (err) {
            throw new err
        }
    }

    getUserFirstName(){
        try {
            return this.requestStr.userFirstName
        } catch (err) {
            throw new err
        }
    }

    getUserLastName(){
        try {
            return this.requestStr.user_last_name
        } catch (err) {
            throw new err
        }
    }

    getUserPassword(){
        try {
            return this.requestStr.userPassword
        } catch (err) {
            throw new err
        }
    }

    getAccessToken(){
        try {
            return this.requestStr.userAccessToken
        } catch (err) {
            throw new err
        }
    }

    getRefreshToken(){
        try {
            return this.requestStr.userRefreshToken
        } catch (err) {
            throw new err
        }
    }
}