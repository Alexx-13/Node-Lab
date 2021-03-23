import { Response } from 'express'
import db from '../../../app'
import { HTTPStatusCodes } from '../../../httpStatus'
const fs = require('fs')
const util = require('util')

interface IProfileFilterMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery
    isAuth: boolean

    getLocalToken()
    getUserName()
    getFirstName()
    getLastName()
    updateAccountDataCollection()

    getOldPassword()
    getNewPassword()
    setPasswordFinalQuery()
    getPasswordFinalQuery()
    updateAccountPasswordCollection()
}

export default class ProfileFilterMongo implements IProfileFilterMongo {
    readonly request
    readonly response
    readonly collectionName: string = 'account'
    public finalQuery = {
        user_password: '',
    }
    isAuth
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    async getLocalToken(){
        try{
            const readFileContent = util.promisify(fs.readFile)
            const data = await readFileContent('.tokens.json')

            if(JSON.parse(data).USER_ACCESS_TOKEN){
                return JSON.parse(data).USER_ACCESS_TOKEN
            }

        } catch (err) {
            throw new err
        }
    }

    getUserName(){
        try {
            return this.requestStr.user_name
        } catch (err) {
            throw new err
        }
    }

    getFirstName(){
        try {
            return this.requestStr.user_first_name
        } catch (err) {
            throw new err
        }
    }

    getLastName(){
        try {
            return this.requestStr.user_last_name
        } catch (err) {
            throw new err
        }
    }

    getOldPassword(){
        try {
            return this.requestStr.user_old_password
        } catch (err) {
            throw new err
        }
    }

    getNewPassword(){
        try {
            return this.requestStr.user_new_password
        } catch (err) {
            throw new err
        }
    }

    setPasswordFinalQuery(){
        try {
            return this.finalQuery.user_password = this.getNewPassword()
        } catch (err) {
            throw new err
        }
    }

    getPasswordFinalQuery(){
        try{
            return { $set: this.setPasswordFinalQuery() }
        } catch (err) {
            throw new err
        }
    }

    updateAccountPasswordCollection(){
        try {
            if(this.isAuth){
                let oldData = { user_password: this.getOldPassword() }
                let newData = { $set: { user_password: this.getNewPassword() } }
    
                if(this.getOldPassword() && this.getNewPassword()){
                    db.default.collection(this.collectionName).find(oldData).toArray((err, result) => {
                        if(err){
                            throw new err
                        } else if(result.length === 0){
                            this.response.send('Incorrect data')
                        } else {
                            db.default.collection(this.collectionName).updateOne(oldData, newData, (err, result) => {
                                if(err){
                                    throw new err
                                } else {
                                    this.response.send('The password was updated')
                                }
                            })
                        }
                    })
                }
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    updateAccountDataCollection(){
        try{
            console.log(this.isAuth)
            if(this.getUserName() && this.getFirstName() && this.getLastName()){
                db.default.collection(this.collectionName).find(this.getLocalToken()).toArray((err, result) => {
                    if(err){
                        throw new err
                    } else if(result.length === 0){
                        this.response.send('Incorrect data')
                    } else {
                        let oldData: object = {
                            user_name: result[0].user_name,
                            user_first_name: result[0].user_first_name,
                            user_last_name: result[0].user_last_name
                        }
                        let newData: object = { 
                            user_name: this.getUserName(),
                            user_first_name: this.getFirstName(),
                            user_last_name: this.getLastName()
                        }

                        db.default.collection(this.collectionName).updateOne(oldData, newData, (err, result) => {
                            if(err){
                                throw new err
                            } else {
                                this.response.send('Profile was successfully updated')
                            }
                        })
                    }
                })
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}