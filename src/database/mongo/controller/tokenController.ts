import { Response } from 'express'
import { HTTPStatusCodes, CollectionNames } from '../../../enum'
const fs = require('fs')
import { db } from '../../../app'
import { ProfileGeneralController, AccountGeneralController } from '../../generalController'

interface ITokenControllerMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined
    accessToken: string
    refreshToken: string

    setFinalQuery()
    getFinalQuery()
    updateToken()
}

export default class TokenControllerMongo implements ITokenControllerMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = CollectionNames.account
    requestStr: { [queryParam: string]: string }
    accessToken
    refreshToken
    public finalQuery

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    setFinalQuery(){
        this.finalQuery = new Object()
        const profileFinder = new ProfileGeneralController(this.request, this.response)
        
        this.finalQuery.refreshToken = profileFinder.getLocalToken()

        return this.finalQuery
    }

    async getFinalQuery(){
        return await this.setFinalQuery()
    }

    updateToken(){
        try{
            db.default.collection(this.collectionName).find(this.getFinalQuery()).toArray((err, results) => {
                if(err){
                    throw new err
                } else if (results.length === 0) {
                    this.response.send('Username or token incorrect')
                } else {
                    const accountFinder = new AccountGeneralController(this.request, this.response)

                    const oldData = { accessToken:  results[0].accessToken }
                    const newData = { $set: { userAccessToken:  accountFinder.handleAccessToken() } }
                    
                    db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
                        if (err) {
                            throw new err
                        } else if (results.length === 0){
                            this.response.send('Incorrect refresh token was provided')
                        } else {
                            let jsonData = {
                                userAccessToken: this.accessToken,
                                userRefreshToken: this.refreshToken
                            }
        
                            fs.writeFile('.tokens.json', 
                                JSON.stringify(jsonData),
                                (err) => {
                                    if(err){ 
                                        throw err
                                    } else {
                                        this.response.send('Access token was successfully refreshed')
                                    }
                                })
                        }
                    })
                }
            })
        } catch(err){
            console.log(err)
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}