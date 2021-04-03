import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { IRegister } from '../../interface'

class Register extends Typegoose implements IRegister {
    @prop()
    public _id!: number

    @prop()
    public userName!: string

    @prop()
    public userPassword!: string

    @prop()
    public userFirstName?: string

    @prop()
    public userLastName?: string

    @prop()
    public userAccessToken!: string;
}

const RegisterModel = new Register().getModelForClass(Register)

export default RegisterModel