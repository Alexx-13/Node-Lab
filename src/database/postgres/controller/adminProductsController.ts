import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../enum'
import { db } from '../../../app'

// interface IAdminControllerMongo {

// }

export default class AdminControllerPostgres {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'products'
    public productId: string | undefined
    public finalQuery = {
        userName: '',
        user_role: '',
        userPassword: '',
        userFirstName: '',
        user_last_name: '',
        userAccessToken: '',
        userRefreshToken: ''
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
                userName: this.requestStr.userName,
                user_role: this.requestStr.user_role,
                userPassword: this.requestStr.userPassword,
                userFirstName: this.requestStr.userPassword,
                user_last_name: this.requestStr.user_last_name,
                userAccessToken: this.requestStr.userAccessToken,
                userRefreshToken: this.requestStr.userRefreshToken
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
