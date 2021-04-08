import { Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Errors } from '../../../enum'
import { AccountGeneralController } from '../../generalController'
import { db } from '../../../app'

interface IAuthenticateControllerPostgres {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined

    setFindQuery()
    getFindQuery()
    getToken()
}

export default class AuthenticateControllerPostgres implements IAuthenticateControllerPostgres {
    readonly request
    readonly response
    readonly collectionName: string = CollectionNames.account
    public finalQuery
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    setFindQuery(){
        if(!this.finalQuery){
            this.finalQuery = new Object()
        }

        let accountFinder = new AccountGeneralController(this.request, this.response)

        this.finalQuery.userName = accountFinder.getUserName()
        this.finalQuery.password = accountFinder.getPassword()

        return this.finalQuery
    }

    getFindQuery() {
        return this.setFindQuery()
    }

    getToken() {
        try {
            const customQuery = 
            `SELECT accessToken from ${this.collectionName} 
            WHERE userName = ${this.finalQuery.userName} 
            AND password = ${this.finalQuery.userPassword}
            `
            db.default.query(customQuery, (err, results) => {
                if (err){
                    throw new err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.NOT_FOUND)
                } else {
                    process.argv[3] = 'true'
                    // this.response.send(results[0].accessToken)
                    this.response.send(results.row)
                }
            })
        } catch (err) {
            this.response.send(Errors.accessTokenRemote)
        }
    }
}
