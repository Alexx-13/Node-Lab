import { prop, Typegoose} from 'typegoose';
import { IUser } from '../../interface'

class User extends Typegoose implements IUser {
    @prop()
    public id!: number

    @prop()
    public role!: string
}

const RegisterModel = new User().getModelForClass(User)

export default RegisterModel