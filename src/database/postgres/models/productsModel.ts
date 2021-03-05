import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IProducts } from '../../interface'

@Entity()
export class Products implements IProducts {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  categoryIds!: string;

  @Column()
  displayName!: string;

  @Column()
  createdAt!: Date;

  @Column()
  minRating!: number;

  @Column()
  price!: number;
}

const ProductsModel = new Products()

export default ProductsModel