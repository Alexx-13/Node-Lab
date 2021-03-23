import cookieSession from 'cookie-session'

export default class SessionHandler {
    readonly middleWare
    request
    response

    constructor(middleWare, request, response){
        this.middleWare = middleWare
        this.request = request
        this.response = response
    }

    setCookieSession(){
        try{
            return this.middleWare.use(cookieSession({
                name: 'session',
                keys: ['key1', 'key2']
            }))
        } catch (err) {
            throw new err
        }
    }

    setAuthSessionTrue(){
        try{
            this.setCookieSession()
            return this.request.session.isAuth = true
        } catch (err) {
            throw new err
        }
    }

    setAuthSessionFalse(){
        try{
            this.setCookieSession()
            return this.request.session.isAuth = false
        } catch (err) {
            throw new err
        }
    }

    getAuthSession(){
        try {
            return this.request.session.isAuth
        } catch (err) {
            throw new err
        }
    }

}