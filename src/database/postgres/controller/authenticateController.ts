import { Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
import db from '../../../app'

interface IAuthenticateControllerPostgres {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery

    getUserName()
    getUserUnhashedPassword()
    setFinalQuery()
    getFinalQuery()
    getToken()
}

export default class AuthenticateControllerPostgres implements IAuthenticateControllerPostgres {
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

    setFinalQuery(){
        try{
            this.finalQuery = {
                user_name: this.getUserName(),
                user_password: this.getUserUnhashedPassword()
            }
            return `SELECT user_access_token from ${this.collectionName} 
                WHERE user_name = ${this.finalQuery.user_name} 
                AND user_password = ${this.finalQuery.user_password}
                `
        } catch(err){
            throw new err
        }
    }

    getFinalQuery() {
        try{
            return this.setFinalQuery()
        } catch(err){
            throw new err
        }
    }

    getToken() {
        try {
            db.default.query(this.getFinalQuery(), (err, results) => {
                if (err){
                    throw new err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    this.response.send(results.row)
                }
            })
        } catch (err) {
            throw new err
        }
    }
}
