import { Response } from 'express'
import { HTTPStatusCodes, UserRole, CollectionNames } from '../../../enum'
import fs from 'fs'
import { db } from '../../../app'
import { RegisterGeneralController } from '../../generalController'

interface IRegisterControllerMongo {
    request
    response: Response
    requestStr: { [queryParam: string]: string }
    collectionName: string
    finalQuery: Object | undefined

    setFindQuery()
    getFindQuery()
    setAccountCollection()
}

export default class RegisterControllerMongo implements IRegisterControllerMongo {
    readonly request
    readonly response: Response
    readonly collectionName: string = CollectionNames.account
    public finalQuery
    requestStr: { [queryParam: string]: string }

    constructor(request, response){
        this.request = request
        this.response = response
        this.requestStr = this.request.body
    }

    setFindQuery() {
        this.finalQuery = new Object()
        let registerFinder = new RegisterGeneralController(this.request, this.response)

        // if(registerFinder.getUserRole() === UserRole.admin || UserRole.buyer){
        this.finalQuery.userName = registerFinder.getUserName()
        this.finalQuery.userRole = registerFinder.getUserRole()
        this.finalQuery.firstName = registerFinder.getUserFirstName()
        this.finalQuery.lastName = registerFinder.getUserLastName()

        return this.finalQuery
        // }
        
    }

    getFindQuery() {
        try{
            return this.setFindQuery()
        } catch(err){
            throw new err
        }
    }

    setAccountCollection(){
        try{
            db.default.collection(this.collectionName).insertOne(this.getFindQuery(), (err, results) => {
                if(err){
                    throw new err
                } else if(results.length === 0){
                    this.response.send(HTTPStatusCodes.BAD_REQUEST)
                } else {
                    let registerFinder = new RegisterGeneralController(this.request, this.response)
                    const jsonData = {
                        userAccessToken: registerFinder.handleAccessToken(),
                        userRefreshToken: registerFinder.handleRefreshToken()
                    }

                    fs.writeFile('.tokens.json', 
                        JSON.stringify(jsonData),
                        (err) => {
                        if(err){
                            this.response.send(HTTPStatusCodes.NOT_FOUND)
                        } else {
                            this.request.session.isAuth = true
                            this.response.send('Account was successfully created' + this.request.session.isAuth)
                        }
                    })
                }
            })
        } catch(err){
            throw new err
        }
    }
}