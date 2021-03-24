import { Response } from 'express'
import db from '../../../app'
import { HTTPStatusCodes } from '../../../httpStatus'
import fs from 'fs'
import util from 'util'

interface IProfileFilterMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string

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

    setDataFinalQuery(){
        try {
            return `UPDATE ${this.collectionName} SET 
                user_name = ${this.getUserName()}
                user_first_name = ${this.getFirstName()}
                user_last_name = ${this.getLastName()}
            `
        } catch (err) {
            throw new err
        }
    }

    getDataFinalQuery(){
        try {
            return this.setDataFinalQuery()
        } catch (err) {
            throw new err
        }
    }

    setPasswordFinalQuery(){
        try {
            return `UPDATE ${this.collectionName} SET 
                user_password = ${this.getNewPassword()}
            `
        } catch (err) {
            throw new err
        }
    }

    getPasswordFinalQuery(){
        try{
            return this.setPasswordFinalQuery()
        } catch (err) {
            throw new err
        }
    }

    updateAccountPasswordCollection(){
        try {
            if(this.getNewPassword() && this.getOldPassword()){
                db.default.query(this.getPasswordFinalQuery(), (err, result) => {
                    if(err){
                        throw new err
                    } else if (!result.row) {
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    }
                })
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }

    updateAccountDataCollection(){
        try{
            if(this.getUserName() && this.getFirstName() && this.getLastName()){
                db.default.query(this.getDataFinalQuery(), (err, result) => {
                    if(err){
                        throw new err
                    } else if (!result.row){
                        this.response.send(HTTPStatusCodes.BAD_REQUEST)
                    } else {
                        this.response.send('Profile was successfully updated')
                    }
                })
            }
        } catch (err) {
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}