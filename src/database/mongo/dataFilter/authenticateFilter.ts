import { Response } from 'express'
import db from '../../../app'

interface IAuthenticateFilterMongo {
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

    setFinalQuery(){
        try{
            return this.finalQuery = {
                user_name: this.getUserName(),
                user_password: this.getUserUnhashedPassword()
            }
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
            const { user_name, user_password } = this.getFinalQuery()

            db.default.collection(this.collectionName).find({ user_name: user_name, user_password: user_password }).toArray((err, result) => {
                if(err){
                    throw new err
                } else if (result.length === 0){
                    this.response.send('Username or password incorrect')
                } else {
                    this.response.send(result[0].user_access_token)
                }
            })
        } catch (err) {
            throw new err
        }
    }
}
