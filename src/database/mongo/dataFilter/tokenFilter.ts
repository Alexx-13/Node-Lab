import { Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
const jwt = require('jsonwebtoken')
import db from '../../../app'

interface ITokenFilterMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery

    getUserName()
    setFinalQuery()
    getFinalQuery()
    getRefreshToken()
    updateToken()
}

export default class TokenFilterMongo implements ITokenFilterMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = 'account'
    readonly secretToken = require('dotenv').config().parsed.ACCESS_TOKEN_SECRET
    requestStr: { [queryParam: string]: string }
    public finalQuery = {
        user_name: ''
    }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
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
            return this.finalQuery.user_name = this.getUserName()
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

    getRefreshToken(){
        try {
            return this.requestStr.user_refresh_token
        } catch (err) {
            throw new err
        }
    }

    updateToken(){
        try{
            this.setFinalQuery()

            db.default.collection(this.collectionName).find({ user_name: this.getFinalQuery().user_name }).toArray((err, result) => {
                if(err){
                    throw new err
                } else if (result.length === 0) {
                    this.response.send('Username or token incorrect')
                } else if (this.getRefreshToken() && this.getFinalQuery()) {
                    jwt.verify(this.secretToken, this.getRefreshToken(), () => {
                        const accessToken = jwt.sign({ user_name: this.getFinalQuery().user_name }, this.secretToken, { expiresIn: '20m' })
                        this.response.json({
                            accessToken
                        })
                    })
                }
            })
        } catch(err){
            console.log(err)
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}