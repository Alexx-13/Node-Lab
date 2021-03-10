import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { IRegister } from '../../interface'

class Register extends Typegoose implements IRegister {
    @prop()
    public id!: number

    @prop()
    public user_name!: string

    @prop()
    public user_password!: string
}

const RegisterModel = new Register().getModelForClass(Register)

export default RegisterModel