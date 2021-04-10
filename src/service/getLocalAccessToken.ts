import { readFileSync } from 'fs'

export const getLocalAccessToken = () => {
    try{
        const data = readFileSync('.tokens.json').toString()
        return JSON.parse(data).accessToken

    } catch (err) {
       throw new err
    }
}

