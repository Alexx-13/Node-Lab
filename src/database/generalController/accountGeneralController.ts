import { CollectionNames, HTTPStatusCodes, Errors, UserRole } from '../../enum'
import randtoken from 'rand-token'

interface IAccountGeneralController {
    collectionName: string
    requestStr: object

    getId()
    getUserName()
    getFirstName()
    getLastName()
    getPassword()
    getAccessToken()
    getRefreshToken()
    getUserRole()
    handleAccessToken()
    handleRefreshToken()
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
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getUserName(){
        try {
            return this.requestStr.userName
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getFirstName(){
        try {
            return this.requestStr.firstName
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getLastName(){
        try {
            return this.requestStr.lastName
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getPassword(){
        try {
            return this.requestStr.password
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getAccessToken(){
        try {
            return this.requestStr.accessToken
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getRefreshToken(){
        try {
            return this.requestStr.refreshToken
        } catch (err) {
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getUserRole(){
        try{
            if(this.requestStr.userRole === UserRole.admin || this.requestStr.userRole ===UserRole.buyer){
                return this.requestStr.userRole
            }
        } catch(err){
            this.response.sendStatus(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    handleAccessToken(){
        try{
            return randtoken.generate(54)
        } catch (err) {
            this.response.send(Errors.accessToken)
        }
    }

    handleRefreshToken(){
        try{
            return randtoken.generate(54)
        } catch (err) {
            this.response.send(Errors.refreshToken)
        }
    }
}