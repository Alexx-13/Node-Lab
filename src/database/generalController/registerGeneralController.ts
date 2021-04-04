import { CollectionNames, HTTPStatusCodes } from '../../enum'
import randtoken from 'rand-token'

interface IRegisterGeneralController {
    handleAccessToken()
    handleRefreshToken()
    getUserName()
    getUserFirstName()
    getUserLastName()
    getUserRole()
    getUserUnhashedPassword()

}

export default class RegisterGeneralController implements IRegisterGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.account
    requestStr!: { [queryParam: string]: string} 
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
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

    getUserName() {
        try{
            return this.requestStr.username
        } catch(err){
            throw new err
        }
    }

    getUserFirstName(){
        try{
            return this.requestStr.firstName
        } catch(err){
            throw new err
        }
    }
    
    getUserLastName(){
        try{
            return this.requestStr.lastName
        } catch(err){
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

    getUserUnhashedPassword() { 
        try{
            return this.requestStr.password
        } catch(err){
            throw new err
        }
    }

}