import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IUser } from '../../interface'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  _id!: number;

  @Column()
  role!: string;
}

const UserModel = new User()

export default UserModel