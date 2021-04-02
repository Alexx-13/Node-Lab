import { Response } from 'express'
import { HTTPStatusCodes } from '../../../enum'
const fs = require('fs')
const randtoken = require('rand-token')
import { db } from '../../../app'

interface ITokenControllerMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery
    accessToken: string
    refreshToken: string

    handleAccessToken()
    handleRefreshToken()
    getUserName()
    setFinalQuery()
    getFinalQuery()
    updateToken()
}

export default class TokenControllerMongo implements ITokenControllerMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = 'account'
    requestStr: { [queryParam: string]: string }
    accessToken
    refreshToken
    public finalQuery = {
        user_name: '',
        user_refresh_token: ''
    }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    handleAccessToken(){
        try {
            return this.accessToken = randtoken.generate(54)
        } catch (err) {
            throw new err
        }
    }

    handleRefreshToken(){
        try {
            return this.refreshToken = this.requestStr.user_refresh_token
        } catch (err) {
            throw new err
        }
    }

    getUserName(){
        try{
            return this.requestStr.user_field
        } catch (err) {
            throw new err
        }
    }

    setFinalQuery(){
        try{
            return this.finalQuery = {
                user_name: this.getUserName(),
                user_refresh_token: this.handleRefreshToken()
            }
        } catch (err) {
            throw new err
        }
    }

    getFinalQuery(){
        try {
            return this.finalQuery
        } catch (err) {
            throw new err
        }
    }

    updateToken(){
        try{
            this.setFinalQuery()

            db.default.collection(this.collectionName).find(this.getFinalQuery()).toArray((err, results) => {
                if(err){
                    throw new err
                } else if (results.length === 0) {
                    this.response.send('Username or token incorrect')
                } else {
                    let oldData = { user_access_token:  results[0].user_access_token }
                    let newData = { $set: { user_access_token:  this.handleAccessToken() } }
                    
                    db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
                        if (err) {
                            throw new err
                        } else {
                            let jsonData = {
                                USER_ACCESS_TOKEN: this.accessToken,
                                USER_REFRESH_TOKEN: this.refreshToken
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