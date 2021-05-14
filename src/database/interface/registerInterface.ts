interface IRegister{
    _id: number
    userName: string
    password: string
    firstName?: string
    lastName?: string
    accessToken: string
    refreshToken: string
}

export default IRegister