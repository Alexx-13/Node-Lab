interface IRegister{
    _id: number
    user_name: string
    user_password: string
    user_first_name?: string
    user_last_name?: string
    user_access_token: string
}

export default IRegister