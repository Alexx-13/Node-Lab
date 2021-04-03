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
        userName: '',
        userRefreshToken: ''
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
            return this.refreshToken = this.requestStr.userRefreshToken
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
                userName: this.getUserName(),
                userRefreshToken: this.handleRefreshToken()
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
                    let oldData = { userAccessToken:  results[0].userAccessToken }
                    let newData = { $set: { userAccessToken:  this.handleAccessToken() } }
                    
                    db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
                        if (err) {
                            throw new err
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