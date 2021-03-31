import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IUser } from '../../interface'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  role!: string;
}

const UserModel = new User()

export default UserModel