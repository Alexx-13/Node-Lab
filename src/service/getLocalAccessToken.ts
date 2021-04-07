import { readFileSync } from 'fs'

export const getLocalAccessToken = () => { // вынести в сервисы
    try{
        const data = readFileSync('.tokens.json').toString()
        return JSON.parse(data).accessToken

    } catch (err) {
       throw new err
    }
}

