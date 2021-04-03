import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IRegister } from '../../interface'

@Entity()
export class Register implements IRegister {
  @PrimaryGeneratedColumn()
  _id!: number

  @Column()
  user_name!: string

  @Column()
  user_password!: string

  @Column()
  user_first_name?: string

  @Column()
  user_last_name?: string

  @Column()
  user_access_token!: string;
}

const RegisterModel = new Register()

export default RegisterModel