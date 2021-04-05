import { CollectionNames } from '../../enum'
import randtoken from 'rand-token'

interface IAccountGeneralController {
    getId()
    getUserName()
    getFirstName()
    getLastName()
    getPassword()
    getAccessToken()
    getRefreshToken()
    getUserRole()
}

export default class AccountGeneralController implements IAccountGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.account
    requestStr!: { [queryParam: string]: string} 
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    getId(){
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

    getFirstName(){
        try {
            return this.requestStr.firstName
        } catch (err) {
            throw new err
        }
    }

    getLastName(){
        try {
            return this.requestStr.lastName
        } catch (err) {
            throw new err
        }
    }

    getPassword(){
        try {
            return this.requestStr.password
        } catch (err) {
            throw new err
        }
    }

    getAccessToken(){
        try {
            return this.requestStr.accessToken
        } catch (err) {
            throw new err
        }
    }

    getRefreshToken(){
        try {
            return this.requestStr.refreshToken
        } catch (err) {
            throw new err
        }
    }

    getUserRole(){
        try{
            return this.requestStr.userRole
        } catch(err){
            throw new err
        }
    }

    handleAccessToken(){
        try{
            return randtoken.generate(54)
        } catch (err) {
            throw new err
        }
    }

    handleRefreshToken(){
        try{
            return randtoken.generate(54)
        } catch (err) {
            throw new err
        }
    }
}