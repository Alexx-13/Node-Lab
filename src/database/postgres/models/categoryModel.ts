import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ICategory } from '../../interface'

@Entity()
export class Category implements ICategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  displayName!: string;
}

const CategoryModel = new Category()

export default CategoryModel