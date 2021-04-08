import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { IRegister } from '../../interface'

class Register extends Typegoose implements IRegister {
    @prop()
    public _id!: number

    @prop()
    public userName!: string

    @prop()
    public password!: string

    @prop()
    public firstName?: string

    @prop()
    public lastName?: string

    @prop()
    public accessToken!: string;

    @prop()
    public refreshToken!: string;
}

const RegisterModel = new Register().getModelForClass(Register)

export default RegisterModel