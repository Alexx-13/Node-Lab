import { Response } from 'express'
import { HTTPStatusCodes } from '../../../enum'
import { db } from '../../../app'

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
        userName: '',
        userPassword: ''
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
            return this.requestStr.userPassword
        } catch(err){
            throw new err
        }
    }

    setFinalQuery(){
        try{
            this.finalQuery = {
                userName: this.getUserName(),
                userPassword: this.getUserUnhashedPassword()
            }
            return `SELECT userAccessToken from ${this.collectionName} 
                WHERE userName = ${this.finalQuery.userName} 
                AND userPassword = ${this.finalQuery.userPassword}
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
