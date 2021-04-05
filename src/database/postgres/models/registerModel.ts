import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IRegister } from '../../interface'

@Entity()
export class Register implements IRegister {
  @PrimaryGeneratedColumn()
  _id!: number

  @Column()
  userName!: string

  @Column()
  userPassword!: string

  @Column()
  userFirstName?: string

  @Column()
  userLastName!: string;

  @Column()
  userAccessToken!: string;
}

const RegisterModel = new Register()

export default RegisterModel