interface IRegister{
    _id: number
    userName: string
    userPassword: string
    userFirstName?: string
    userLastName?: string
    userAccessToken: string
}

export default IRegister