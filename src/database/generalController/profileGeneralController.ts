import { CollectionNames, Errors, HTTPStatusCodes } from '../../enum'
import fs, { readFileSync } from 'fs'
import util from 'util'

interface IProfileGeneralController {
    collectionName: string
    requestStr: object
    
    getOldPassword()
    getNewPassword()
    getPasswordQuery()
}

export default class ProfileGeneralController implements IProfileGeneralController{
    readonly request
    readonly response
    readonly collectionName = CollectionNames.account
    requestStr!: { [queryParam: string]: string} 
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    getOldPassword(){
        try {
            return this.requestStr.oldPassword
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getNewPassword(){
        try {
            return this.requestStr.newPassword
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    getPasswordQuery(){
        try {
            return this.getNewPassword()
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}