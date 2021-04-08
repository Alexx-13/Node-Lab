import { Response } from 'express'
import { HTTPStatusCodes, CollectionNames, Errors, Success } from '../../../enum'
const fs = require('fs')
import { db } from '../../../app'
import { AccountGeneralController } from '../../generalController'

interface ITokenControllerPostgres {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined

    updateToken()
}

export default class TokenControllerPostgres implements ITokenControllerPostgres {
    readonly request
    readonly response: Response
    readonly collectionName: string = CollectionNames.account
    requestStr: { [queryParam: string]: string }
    public finalQuery

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.query
    }

    updateToken(){
        try {
            const accountFinder = new AccountGeneralController(this.request, this.response)
            const token = accountFinder.handleAccessToken()
            db.default.query(
                `UPDATE ${this.collectionName} SET 
                accessToken = ${token}
                `,
                (err, results) => {
                if (err){
                    throw new err
                } else if (!results.row){
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    let jsonData = {
                        userAccessToken: token
                    }

                    fs.writeFile('.tokens.json', 
                        JSON.stringify(jsonData),
                        (err) => {
                            if(err){ 
                                this.response.send(`${Errors.accessToken} ${Errors.refreshToken}`)
                            } else {
                                this.response.send(Success.accessTokenRefresh)
                            }
                        }
                    )
                }
                }
            )
        } catch(err){
            this.response.send(HTTPStatusCodes.BAD_REQUEST)
        }
    }
}