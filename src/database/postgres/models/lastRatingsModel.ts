import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ILastRatings } from '../../interface'

@Entity()
export class LastRatings implements ILastRatings {
  @PrimaryGeneratedColumn()
<<<<<<< HEAD
  _id!: number;
=======
  id!: number;
>>>>>>> main

  @Column()
  ratings!: string;
}

const LastRatingsModel = new LastRatings()

export default LastRatingsModel