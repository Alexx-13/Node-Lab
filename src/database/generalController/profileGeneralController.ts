import { CollectionNames } from '../../enum'
import fs from 'fs'
import util from 'util'

interface IProfileGeneralController {
    getLocalToken()
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

    async getLocalToken(){
        try{
            const readFileContent = util.promisify(fs.readFile)
            const data = await readFileContent('.tokens.json').toString()

            if(JSON.parse(data).accessToken){
                return JSON.parse(data).accessToken
            }

        } catch (err) {
            throw new err
        }
    }

    getOldPassword(){
        try {
            return this.requestStr.oldPassword
        } catch (err) {
            throw new err
        }
    }

    getNewPassword(){
        try {
            return this.requestStr.newPassword
        } catch (err) {
            throw new err
        }
    }

    getPasswordQuery(){
        try {
            return this.getNewPassword()
        } catch (err) {
            throw new err
        }
    }
    
}