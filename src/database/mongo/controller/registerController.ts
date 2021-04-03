import { Response } from 'express'
import { HTTPStatusCodes, UserRole } from '../../../enum'
import bcrypt from "bcrypt"
import randtoken from 'rand-token'
import fs from 'fs'
import { db } from '../../../app'

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
        userName: '',
        user_role: '',
        userPassword: '',
        userFirstName: '',
        user_last_name: '',
        userAccessToken: '',
        userRefreshToken: ''
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
            return this.requestStr.userFirstName
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
            return this.requestStr.userPassword
        } catch(err){
            throw new err
        }
    }

    setHashedUserPassword(){
        try{
            (async () => {
                const salt = await bcrypt.genSalt(10)
                return this.finalQuery.userPassword = await bcrypt.hash(this.getUserUnhashedPassword(), salt)
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
                    userName: this.getUserName(),
                    user_role: this.getUserRole(),
                    userPassword: this.getUserUnhashedPassword(),
                    userFirstName: this.getUserFirstName(),
                    user_last_name: this.getUserLastName(),
                    userAccessToken: this.handleAccessToken(),
                    userRefreshToken: this.handleRefreshToken()
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
                        userAccessToken: this.accessToken,
                        userRefreshToken: this.refreshToken
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