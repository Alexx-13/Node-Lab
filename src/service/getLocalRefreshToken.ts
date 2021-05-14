import { readFileSync } from 'fs'

export const getLocalRefreshToken = () => {
    try{
        const data = readFileSync('.tokens.json').toString()
        return JSON.parse(data).refreshToken

    } catch (err) {
       throw new err
    }
}