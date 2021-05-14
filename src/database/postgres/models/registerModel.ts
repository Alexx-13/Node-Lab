import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IRegister } from '../../interface'

@Entity()
export class Register implements IRegister {
  @PrimaryGeneratedColumn()
  _id!: number

  @Column()
  userName!: string

  @Column()
  password!: string

  @Column()
  firstName?: string

  @Column()
  lastName!: string;

  @Column()
  accessToken!: string;
}

const RegisterModel = new Register()

export default RegisterModel