import { Response } from 'express'
const bcrypt = require("bcrypt")
const randtoken = require('rand-token')
const fs = require('fs')
import db from '../../../app'

interface IRegisterFilterMongo {
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
    getUserFirstName()
    getUserLastName()
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
    accessToken
    refreshToken
    public finalQuery = {
        user_name: '',
        user_password: '',
        user_first_name: '',
        user_last_name: '',
        user_access_token: '',
        user_refresh_token: ''
    }
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    handleAccessToken(){
        try{
            return this.accessToken = randtoken.generate(54)
        } catch (err) {
            throw new err
        }
    }

    handleRefreshToken(){
        try{
            return this.refreshToken = randtoken.generate(54)
        } catch (err) {
            throw new err
        }
    }

    getUserName() {
        try{
            return this.requestStr.user_field
        } catch(err){
            throw new err
        }
    }

    getUserFirstName(){
        try{
            return this.requestStr.user_first_name
        } catch(err){
            throw new err
        }
    }
    
    getUserLastName(){
        try{
            return this.requestStr.user_last_name
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

    setHashedUserPassword(){
        try{
            (async () => {
                const salt = await bcrypt.genSalt(10)
                return this.finalQuery.user_password = await bcrypt.hash(this.getUserUnhashedPassword(), salt)
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
            return this.finalQuery = {
                user_name: this.getUserName(),
                user_password: this.getUserUnhashedPassword(),
                user_first_name: this.getUserFirstName(),
                user_last_name: this.getUserLastName(),
                user_access_token: this.handleAccessToken(),
                user_refresh_token: this.handleRefreshToken()
            }
        } catch (err){
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

    setAccountCollection(){
        try{
            db.default.collection(this.collectionName).insertOne(this.getFinalQuery(), (err, result) => {
                if(err){
                    throw new err
                } else {
                    fs.writeFile('.tokens.json', 
                        {
                            USER_ACCESS_TOKEN: this.accessToken,
                            SER_REFRESH_TOKEN: this.refreshToken
                        },
                        (err) => {
                        if(err) throw err
                    })
                    this.response.send('Account was successfully created')
                }
            })
        } catch(err){
            throw new err
        }
    }
}