import { Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
const bcrypt = require("bcrypt")
const randtoken = require('rand-token')
const fs = require('fs')
import db from '../../../app'

interface IRegisterFilterPostgres {
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

export default class RegisterFilterPostgres implements IRegisterFilterPostgres {
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
            this.finalQuery = {
                user_name: this.getUserName(),
                user_password: this.getUserUnhashedPassword(),
                user_first_name: this.getUserFirstName(),
                user_last_name: this.getUserLastName(),
                user_access_token: this.handleAccessToken(),
                user_refresh_token: this.handleRefreshToken()
            }

            return `INSERT INTO ${this.collectionName} 
                (${Object.keys(this.finalQuery).join()})
                VALUES 
                (${Object.values(this.finalQuery).join()})
            `
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
            db.default.query(this.getFinalQuery(), (err, results) => {
                if (err){
                    throw new err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    let jsonData = {
                        USER_ACCESS_TOKEN: this.accessToken,
                        USER_REFRESH_TOKEN: this.refreshToken
                    }

                    fs.writeFile('.tokens.json', 
                        JSON.stringify(jsonData),
                        (err) => {
                        if(err){
                            throw new err
                        } else {
                            this.response.send('Account was successfully created')
                        }
                    })
                }
            })
        } catch(err){
            throw new err
        }
    }
}