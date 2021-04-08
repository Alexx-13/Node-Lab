import { Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Errors, Success } from '../../../enum'
const fs = require('fs')
import { db } from '../../../app'
import { AccountGeneralController } from '../../generalController'

interface ITokenControllerMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined

    updateToken()
}

export default class TokenControllerMongo implements ITokenControllerMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = CollectionNames.account
    requestStr: { [queryParam: string]: string }
    public finalQuery

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    updateToken(){
        try {
            const accountFinder = new AccountGeneralController(this.request, this.response)

            db.default.collection(this.collectionName)
            .find({ refreshToken: this.requestStr.refreshToken })
            .toArray((err, results) => {
                    if(err){
                        throw new err
                    } else if (results.length === 0) {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    } else {
                        const oldAccessToken = results[0].accessToken
                        const newAccessToken = accountFinder.handleAccessToken()
                        const oldRefreshToken = results[0].refreshToken
                        const oldData = { accessToken:  oldAccessToken }
                        const newData = { $set: { accessToken:  newAccessToken } }

                        let jsonData = {
                            userAccessToken: newAccessToken,
                            userRefreshToken: oldRefreshToken
                        }

                        db.default.collection(this.collectionName)
                        .updateOne(oldData, newData, (err, results) => {
                            if(err){
                                throw new err
                            } else if(results.length === 0){
                                this.response.send(HTTPStatusCodes.BAD_REQUEST)
                            } else {
                                fs.writeFile('.tokens.json', 
                                JSON.stringify(jsonData),
                                (err) => {
                                    if(err){ 
                                        this.response.send(`${Errors.accessToken} ${Errors.refreshToken}`)
                                    } else {
                                        this.response.send(Success.accessTokenRefresh)
                                    }
                                })
                            }
                        })
                    }
                })
        } catch(err){
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}