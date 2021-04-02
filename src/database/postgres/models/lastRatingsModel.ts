import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ILastRatings } from '../../interface'

@Entity()
export class LastRatings implements ILastRatings {
  @PrimaryGeneratedColumn()
  _id!: number;

  @Column()
  ratings!: string;
}

const LastRatingsModel = new LastRatings()

export default LastRatingsModel