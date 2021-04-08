import { Response } from 'express'
import { db } from '../../../app'
import { HTTPStatusCodes, CollectionNames, Success } from '../../../enum'
import { ProfileGeneralController, AccountGeneralController } from '../../generalController'
import { getLocalAccessToken } from '../../../service'

interface IProfileControllerMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined

    setFindAccountPasswordQuery()
    getFindAccountPasswordQuery()
    updateAccountPasswordCollection()
    setFindAccountDataQuery()
    getFindAccountDataQuery()
    updateAccountDataCollection()
}

export default class ProfileControllerMongo implements IProfileControllerMongo {
    readonly request
    readonly response
    readonly collectionName: string = CollectionNames.account
    public finalQuery
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    setFindAccountPasswordQuery(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        let profileFinder = new ProfileGeneralController(this.request, this.response)

        if(this.requestStr.oldPassword && this.requestStr.newPassword){
            this.finalQuery.accessToken = getLocalAccessToken()
            this.finalQuery.oldPassword = profileFinder.getPasswordQuery()
            this.finalQuery.newPassword = profileFinder.getNewPassword()
        }

        return this.finalQuery
    }

    getFindAccountPasswordQuery(){
        return this.setFindAccountPasswordQuery()
    }

    updateAccountPasswordCollection(){
        try {
            this.getFindAccountPasswordQuery()

            db.default.query(
                `UPDATE ${this.collectionName} SET 
                password = ${this.finalQuery.password()}
                `
            , (err, results) => {
                if(err){
                    throw new err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    this.response.send(Success.passwordUpdate)
                }
            })
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    setFindAccountDataQuery(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        let accountFinder = new AccountGeneralController(this.request, this.response)

        if(this.requestStr.userName){
            this.finalQuery.userName = accountFinder.getUserName()
        }

        if(this.requestStr.firstName){
            this.finalQuery.firstName = accountFinder.getFirstName()
        }

        if(this.requestStr.lastName){
            this.finalQuery.lastName = accountFinder.getLastName()
        }

        if(this.requestStr.password){
            this.finalQuery.password = accountFinder.getPassword()
        }

        this.finalQuery.accessToken = getLocalAccessToken()

        return this.finalQuery
    }

    getFindAccountDataQuery(){
        return this.setFindAccountDataQuery()
    }

    updateAccountDataCollection(){
        try{
            this.getFindAccountDataQuery()

            db.default.query(
                `UPDATE ${this.collectionName} SET 
                userName = ${this.finalQuery.userName()}
                firstName = ${this.finalQuery.firstName()}
                lastName = ${this.finalQuery.lastName()}
                `
            , (err, results) => {
                if(err){
                    throw new err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    this.response.send(Success.passwordUpdate)
                }
            })
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}