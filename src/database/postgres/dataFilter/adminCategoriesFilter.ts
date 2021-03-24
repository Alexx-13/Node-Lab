import { Request, Response } from 'express'
import { HTTPStatusCodes } from '../../../httpStatus'
import db from '../../../app'

// interface IAdminFilterMongo {

// }

export default class AdminFilterPostgres {
    readonly request: Request
    readonly response: Response
    public requestStr: { [queryParam: string]: string }
    public collectionName = 'categories'
    public categoriesId: string | undefined
    public finalQuery = {
        id: '',
        displayName: ''
    }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }
    

    getCategoriesId(){
        try{
            return this.categoriesId = this.request.params.id
        } catch(err){
            throw new err
        }
    }

    getSearchByIdQuery(){
        try{
            return `SELECT * FROM ${this.collectionName} WHERE id = ${this.getCategoriesId}`
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
                id: this.getCategoriesId(),
                displayName: this.requestStr.displayName
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
            return `DELETE FROM ${this.collectionName} WHERE id = ${this.getCategoriesId()}`
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
