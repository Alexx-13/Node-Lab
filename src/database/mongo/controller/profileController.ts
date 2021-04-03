import { Response } from 'express'
import { db } from '../../../app'
import { HTTPStatusCodes } from '../../../enum'
import fs from 'fs'
import util from 'util'

interface IProfileControllerMongo {
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

export default class ProfileControllerMongo implements IProfileControllerMongo {
    readonly request
    readonly response
    readonly collectionName: string = 'account'
    public finalQuery = {
        userPassword: '',
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
            const data = await readFileContent('.tokens.json').toString()

            if(JSON.parse(data).userAccessToken){
                return JSON.parse(data).userAccessToken
            }

        } catch (err) {
            throw new err
        }
    }

    getUserName(){
        try {
            return this.requestStr.userName
        } catch (err) {
            throw new err
        }
    }

    getFirstName(){
        try {
            return this.requestStr.userFirstName
        } catch (err) {
            throw new err
        }
    }

    getLastName(){
        try {
            return this.requestStr.userLastName
        } catch (err) {
            throw new err
        }
    }

    getOldPassword(){
        try {
            return this.requestStr.userOldPassword
        } catch (err) {
            throw new err
        }
    }

    getNewPassword(){
        try {
            return this.requestStr.userNewPassword
        } catch (err) {
            throw new err
        }
    }

    setPasswordFinalQuery(){
        try {
            return this.finalQuery.userPassword = this.getNewPassword()
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
                const oldData = { userPassword: this.getOldPassword() }
                const newData = { $set: { userPassword: this.getNewPassword() } }
    
                if(this.getOldPassword() && this.getNewPassword()){
                    db.default.collection(this.collectionName).find(oldData).toArray((err, results) => {
                        if(err){
                            throw new err
                        } else if(results.length === 0){
                            this.response.send('Incorrect data')
                        } else {
                            db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
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
                db.default.collection(this.collectionName).find(this.getLocalToken()).toArray((err, results) => {
                    if(err){
                        throw new err
                    } else if(results.length === 0){
                        this.response.send('Incorrect data')
                    } else {
                        const oldData: object = {
                            userName: results[0].userName,
                            userFirstName: results[0].userFirstName,
                            user_last_name: results[0].user_last_name
                        }
                        const newData: object = { 
                            userName: this.getUserName(),
                            userFirstName: this.getFirstName(),
                            user_last_name: this.getLastName()
                        }

                        db.default.collection(this.collectionName).updateOne(oldData, newData, (err, results) => {
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