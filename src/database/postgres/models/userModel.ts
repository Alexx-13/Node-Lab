import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IUser } from '../../interface'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
<<<<<<< HEAD
  _id!: number;
=======
  id!: number;
>>>>>>> main

  @Column()
  role!: string;
}

const UserModel = new User()

export default UserModel