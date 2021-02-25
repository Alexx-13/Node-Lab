import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { ICategory } from '../../interface'

class Category extends Typegoose implements ICategory{
    @prop()
    public id!: number

    @prop()
    public displayName!: string
}

const CategoryModel = new Category().getModelForClass(Category)

export default CategoryModel
