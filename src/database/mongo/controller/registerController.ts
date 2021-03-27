import { Response } from 'express'
import { HTTPStatusCodes, UserRole } from '../../../enum'
import bcrypt from "bcrypt"
import randtoken from 'rand-token'
import fs from 'fs'
import db from '../../../app'

interface IRegisterControllerMongo {
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
    getUserRole()
    getUserUnhashedPassword()
    setHashedUserPassword()
    getHashedUserPassword()
    setFinalQuery()
    getFinalQuery()
    setAccountCollection()
}

export default class RegisterControllerMongo implements IRegisterControllerMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = 'account'
    accessToken
    refreshToken
    public finalQuery = {
        user_name: '',
        user_role: '',
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

    getUserRole(){
        try{
            return this.requestStr.user_role
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
            if(this.getUserRole() === UserRole.admin|| this.getUserRole() === UserRole.buyer){
                return this.finalQuery = {
                    user_name: this.getUserName(),
                    user_role: this.getUserRole(),
                    user_password: this.getUserUnhashedPassword(),
                    user_first_name: this.getUserFirstName(),
                    user_last_name: this.getUserLastName(),
                    user_access_token: this.handleAccessToken(),
                    user_refresh_token: this.handleRefreshToken()
                }
            } else {
                this.response.send(HTTPStatusCodes.BAD_REQUEST)
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
            db.default.collection(this.collectionName).insertOne(this.getFinalQuery(), (err, results) => {
                if(err){
                    throw new err
                } else {
                    const jsonData = {
                        USER_ACCESS_TOKEN: this.accessToken,
                        USER_REFRESH_TOKEN: this.refreshToken
                    }

                    fs.writeFile('.tokens.json', 
                        JSON.stringify(jsonData),
                        (err) => {
                        if(err){
                            this.response.send(HTTPStatusCodes.NOT_FOUND)
                        } else {
                            this.request.session.isAuth = true
                            this.response.send('Account was successfully created' + this.request.session.isAuth)
                        }
                    })
                }
            })
        } catch(err){
            throw new err
        }
    }
}