import { Request, Response } from 'express'
const bcrypt = require("bcrypt");
import db from '../../../app'


interface IRegisterFilterMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery

    getUserName()
    getUserUnhashedPassword()
    setHashedUserPassword()
    getHashedUserPassword()
    setFinalQuery()
    getFinalQuery()
    setAccountCollection()
}

export default class RegisterFilterMongo implements IRegisterFilterMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = 'account'
    public finalQuery = {
        user_name: '',
        user_password: ''
    }
    requestStr: { [queryParam: string]: string }
    private user_name
    private user_password

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    getUserName() {
        try{
            return this.user_name = this.requestStr.user_field
        } catch(err){
            throw new err
        }
    }

    getUserUnhashedPassword() { 
        try{
            return this.user_password = this.requestStr.user_password
        } catch(err){
            throw new err
        }
    }

    setHashedUserPassword(){
        try{
            (async () => {
                const salt = await bcrypt.genSalt(10)
                return this.user_password = await bcrypt.hash(this.getUserUnhashedPassword(), salt)
            })()
        } catch(err){
            throw new err
        }
    }

    getHashedUserPassword() {
        try {
            return this.setHashedUserPassword()
        } catch (err) {
            throw new err
        }
    }

    setFinalQuery() {
        try{
            this.finalQuery.user_name = this.getUserName()
            this.finalQuery.user_password = this.getUserUnhashedPassword()
            return this.finalQuery
        } catch (err){
            throw new err
        }
    }

    getFinalQuery() {
        try{
            this.setFinalQuery()
            console.log(this.setFinalQuery())
        } catch(err){
            throw new err
        }
    }


    setAccountCollection(){
        try{
            db.default.collection(this.collectionName).insertOne(this.getFinalQuery(), (err, result) => {
                if(err){
                    throw new err
                } else {
                    // console.log(result)
                }
            })
        } catch(err){
            throw new err
        }
    }

}