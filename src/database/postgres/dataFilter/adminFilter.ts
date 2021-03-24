import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
import db from '../../../app'

// interface IAdminFilterMongo {

// }

export default class AdminFilterMongo {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'products'
    public productId: string | undefined
    public finalQuery = {
        user_name: '',
        user_role: '',
        user_password: '',
        user_first_name: '',
        user_last_name: '',
        user_access_token: '',
        user_refresh_token: ''
    }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }
    

    getProductId(){
        try{
            this.productId = this.request.params.id
        } catch(err){
            throw new err
        }
    }

    getSearchByIdQuery(){
        try{
            return `SELECT * FROM ${this.collectionName} WHERE id = ${this.getProductId}`
        } catch(err){
            throw new err
        }
    }

    makeDBSearchById(){
        db.default.query(this.getSearchByIdQuery(), (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }

    getPostByIdQuery(){
        try{
            this.finalQuery = {
                user_name: this.requestStr.user_name,
                user_role: this.requestStr.user_role,
                user_password: this.requestStr.user_password,
                user_first_name: this.requestStr.user_password,
                user_last_name: this.requestStr.user_last_name,
                user_access_token: this.requestStr.user_access_token,
                user_refresh_token: this.requestStr.user_refresh_token
            }

            return `INSERT INTO ${this.collectionName} 
                (${Object.keys(this.finalQuery).join()})
                VALUES 
                (${Object.values(this.finalQuery).join()})
            `
           
        } catch(err){
            throw new err
        }
    }

    makeDBPost(){
        db.default.query(this.getPostByIdQuery(), (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }

    getDeleteByIdQuery(){
        try{
            return `DELETE FROM ${this.collectionName} WHERE id = ${this.getProductId()}`
        } catch(err){
            throw new err
        }
    }

    makeDBDeleteById(){
        db.default.query(this.getDeleteByIdQuery(), (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })    
    }
    
    getDBPatchByIdQuery(){
        try{
            return `UPDATE ${this.collectionName} SET ${this.requestStr}`
        } catch(err){
            throw new err
        }
    }

    makeDBPathcById(){
        db.default.query(this.getDBPatchByIdQuery(), (err, results) => {
            if (err){
                throw err;
            } else if (!results.row){
                this.response.send(HTTPStatusCodes.NOT_FOUND)
            } else {
                this.response.send(results)
            }
        })
    }

}
