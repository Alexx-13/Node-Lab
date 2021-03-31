import db from '../app'
import { HTTPStatusCodes } from '../enum'

export default class SessionHandler {
    readonly request
    readonly response
    public requestStr: { [queryParam: string]: string }
    readonly collectionName: string = 'account'
    
    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = request.query
    }

    setMongoQuery(){
        try {
            return { user_role: this.requestStr.user_role }
        } catch (err) {
            throw new err
        }
    }

    setPostgresQuery(){
        try {
            return `SELECT user_role FROM ${this.collectionName}`
        } catch (err) {
            throw new err
        }
    }

    getUserRoleMongo(){
        try {
            return db.default.collection(this.collectionName).findOne(this.setMongoQuery()).toArray((err, results) => {
                if (err) {
                    throw err
                } else if (results.length === 0) {
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    return results
                }
            })
        } catch (err) {
            throw new err
        }
    }

    getUserRolePostgres(){
        try {
            return db.default.query(this.setPostgresQuery(), (err, results) => {
                if (err){
                    throw err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    return results.rows
                }
            })
        } catch (err) {
            throw new err
        }
    }
}