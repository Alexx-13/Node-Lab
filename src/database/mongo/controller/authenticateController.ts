import { Response } from 'express'
import { db } from '../../../app'

interface IAuthenticateControllerMongo {
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

export default class AuthenticateControllerMongo implements IAuthenticateControllerMongo {
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
            return this.finalQuery = {
                userName: this.getUserName(),
                userPassword: this.getUserUnhashedPassword()
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
            const { userName, userPassword } = this.getFinalQuery()

            db.default.collection(this.collectionName).find({ userName: userName, userPassword: userPassword }).toArray((err, results) => {
                if(err){
                    throw new err
                } else if (results.length === 0){
                    this.response.send('Username or password incorrect')
                } else {
                    this.response.send(results[0].userAccessToken)
                }
            })
        } catch (err) {
            throw new err
        }
    }
}
