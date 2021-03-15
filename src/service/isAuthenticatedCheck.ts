import db from '../app'
const fs = require('fs')
const util = require('util')

interface IIsAuthenticatedCheck {
    collectionName
    getLocalToken()
    checkForAuthentication()
}

export default class IsAuthenticatedCheck implements IIsAuthenticatedCheck {
    public collectionName

    constructor(collectionName){
        this.collectionName = collectionName
    }

    async getLocalToken(){
        try{
            const readFileContent = util.promisify(fs.readFile)
            const data = await readFileContent('.tokens.json')

            if(JSON.parse(data).USER_ACCESS_TOKEN){
                return JSON.parse(data).USER_ACCESS_TOKEN
            }

        } catch (err) {
            throw new err
        }
    }

    async checkForAuthentication() {
        try {
            process.argv[3] = 'true'
            let token = await this.getLocalToken()
            await db.default.collection(this.collectionName).find({ user_access_token: token }).toArray((err, result) => {
                if(err){
                    throw new err
                } else if (result.length === 0){
                    console.log('Y')
                } else {
                    process.argv[3] = 'true'
                }
            })
        } catch (err) {
            throw new err
        }
    }
}