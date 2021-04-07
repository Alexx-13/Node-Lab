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
            const oldData = { userPassword: this.finalQuery.oldPassword }
            const newData = { $set: { userPassword: this.finalQuery.newPassword } }
    
            db.default.collection(this.collectionName)
            .find(this.finalQuery.accessToken)
            .toArray((err, results) => {
                if(err){
                    throw new err
                } else if (results.length === 0) {
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    db.default.collection(this.collectionName)
                    .updateOne(oldData, newData, (err, results) => {
                        if(err){
                            throw new err
                        } else if(results.length === 0){
                            this.response.send(HTTPStatusCodes.BAD_REQUEST)
                        } else {
                            this.response.send(Success.passwordUpdate)
                        }
                    })
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
        let profileFinder = new ProfileGeneralController(this.request, this.response)

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

            db.default.collection(this.collectionName)
            .find(this.finalQuery.localToken)
            .toArray((err, results) => {
                if(err){
                    throw new err
                } else if(results.length === 0){
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    const oldData: object = {
                        userName: results[0].userName,
                        firstName: results[0].firstName,
                        lastName: results[0].lastName,
                        password: results[0].password
                    }

                    const newData: object = { 
                        userName: this.finalQuery.userName,
                        firstName: this.finalQuery.firstName,
                        lastName: this.finalQuery.lastName,
                        password:  this.finalQuery.password
                    }

                    db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
                        if(err){
                            throw new err
                        } else if (results.length === 0) {
                            this.response.send(HTTPStatusCodes.BAD_REQUEST)
                        } else {
                            this.response.send(Success.accountUpdate)
                        }
                    })
                }
            })
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}