import { Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Success, Errors } from '../../../enum'
import fs from 'fs'
import { db } from '../../../app'
import { AccountGeneralController } from '../../generalController'

interface IRegisterControllerMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined

    setFindQuery()
    getFindQuery()
    setAccountCollection()
}

export default class RegisterControllerMongo implements IRegisterControllerMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = CollectionNames.account
    public finalQuery
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    setFindQuery() {
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        let accountFinder = new AccountGeneralController(this.request, this.response)

        if(this.requestStr.userRole){
            this.finalQuery.userRole = accountFinder.getUserRole()
            process.argv[4] = this.finalQuery.userRole
        }

        if(this.requestStr.userName && this.requestStr.password){
            this.finalQuery.userName = accountFinder.getUserName()
            this.finalQuery.password = accountFinder.getPassword()
            this.finalQuery.userRole = accountFinder.getUserRole()
            this.finalQuery.firstName = accountFinder.getFirstName()
            this.finalQuery.lastName = accountFinder.getLastName()
            this.finalQuery.accessToken = accountFinder.handleAccessToken()
            this.finalQuery.refreshToken = accountFinder.handleRefreshToken()
        } else {
            return this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }

        return this.finalQuery
    }

    getFindQuery() {
        try{
            return this.setFindQuery()
        } catch(err){
            throw new err
        }
    }

    setAccountCollection(){
        try{
            db.default.collection(this.collectionName)
            .insertOne(this.getFindQuery(), (err, results) => {
                if(err){
                    throw new err
                } else if(results.length === 0){
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    const jsonData = {
                        accessToken: this.finalQuery.accessToken,
                        refreshToken: this.finalQuery.refreshToken
                    }

                    fs.writeFile('.tokens.json', 
                        JSON.stringify(jsonData),
                        (err) => {
                        if(err){
                            this.response.send(`${Errors.accessToken} ${Errors.refreshToken}`)
                        } else {
                            process.argv[3] = 'true'
                            this.response.send(`${Success.accountCreate} ${this.request.session.isAuth}`)
                        }
                    })
                }
            })
        } catch(err){
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}