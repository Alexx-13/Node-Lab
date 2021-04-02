import { prop, Typegoose} from 'typegoose';
import { IUser } from '../../interface'

class User extends Typegoose implements IUser {
    @prop()
<<<<<<< HEAD
    public _id!: number
=======
    public id!: number
>>>>>>> main

    @prop()
    public role!: string
}

const RegisterModel = new User().getModelForClass(User)

export default RegisterModel