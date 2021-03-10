import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
import db from '../../../app'

interface IAuthenticateFilterMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery

    getUserName()
    getUserUnhashedPassword()
    getFinalQuery()
    handleJWTToken()
}

export default class AuthenticateFilterMongo implements IAuthenticateFilterMongo {
    readonly request
    readonly response
    readonly collectionName: string = 'account'
    public finalQuery = {
        user_name: '',
        user_password: ''
    }
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    getUserName() {
        try{
            return this.requestStr.user_field
        } catch(err){
            throw new err
        }
    }

    getUserUnhashedPassword() { 
        try{
            return this.requestStr.user_password
        } catch(err){
            throw new err
        }
    }

    getFinalQuery() {
        try{
            return this.finalQuery = {
                user_name: this.getUserName(),
                user_password: this.getUserUnhashedPassword()
            }
        } catch(err){
            throw new err
        }
    }

    handleJWTToken() {
        try {
            const { user_name, user_password } = this.getFinalQuery()

            db.default.collection(this.collectionName).find({ user_name: user_name, user_password: user_password }).toArray((err, result) => {
                if(err){
                    throw new err
                } else if (result.length === 0){
                    this.response.send('Username or password incorrect')
                } else {
                    const accessToken = jwt.sign({ user_name: user_name }, require('dotenv').config().parsed.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })
                    this.response.json({
                        accessToken
                    })
                }
            })
        } catch (err) {
            throw new err
        }
    }
}
