import { Response } from 'express'
import { HTTPStatusCodes } from '../../../enum'
import fs from 'fs'
import randtoken from 'rand-token'
import { db } from '../../../app'

interface ITokenControllerPostgres {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    accessToken: string
    refreshToken: string

    handleAccessToken()
    handleRefreshToken()
    getUserName()
    setFindQuery()
    getFindQuery()
    updateToken()
}

export default class TokenControllerPostgres implements ITokenControllerPostgres {
    readonly request
    readonly response: Response
    readonly collectionName: string = 'account'
    requestStr: { [queryParam: string]: string }
    accessToken
    refreshToken

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

    setFindQuery(){
        try{
            return `UPDATE ${this.collectionName} SET user_access_token = ${this.handleAccessToken()}`
        } catch (err) {
            throw new err
        }
    }

    getFindQuery(){
        try {
            return this.setFindQuery()
        } catch (err) {
            throw new err
        }
    }


  

    updateToken(){
        try{
            db.default.query(this.getFindQuery(), (err, results) => {
                if (err){
                    throw new err
                } else if (!results.row){
                    this.response.send('Username or token incorrect')
                } else {
                    const jsonData = {
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
                        }
                    )
                }
            })
        } catch(err){
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}