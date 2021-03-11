import { Response } from 'express'
import db from '../../../app'
import { HTTPStatusCodes } from '../../../httpStatus'
const fs = require('fs');

interface IProfileFilterMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery
    isAuth: boolean

    checkForAuthetication()

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

    checkForAuthetication(): Promise<boolean>{
        try {
            return new Promise((resolve, reject) => {
                fs.readFile('.tokens.json', 'utf8', (err, data) => {
                    if (err) {
                        reject(err)
                        return
                    }
                    let token 
                    if(JSON.parse(data).USER_ACCESS_TOKEN){
                        token = JSON.parse(data).USER_ACCESS_TOKEN
                    }

                    db.default.collection(this.collectionName).find({ user_access_token: token }).toArray((err, result) => {
                        if(err){
                            throw new err
                        } else if (result.legth === 0){
                            this.response.send(HTTPStatusCodes.BAD_REQUEST)
                            return this.isAuth = false
                        } else {
                            return this.isAuth = true
                        }
                    })
                    resolve(this.isAuth = true)
                })
            }).then(this.isAuth)
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
            if(this.isAuth){
                let inputData = { 
                    user_name: this.getUserName(),
                    user_first_name: this.getFirstName(),
                    user_last_name: this.getLastName()
                }
    
                if(this.getUserName() && this.getFirstName() && this.getLastName()){
                    db.default.collection(this.collectionName).find(inputData).toArray((err, result) => {
                        if(err){
                            throw new err
                        } else if(result.length === 0){
                            this.response.send('Incorrect data')
                        }
                    })
                }
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}