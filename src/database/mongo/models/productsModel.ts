import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { IProducts } from '../../interface'

class Product extends Typegoose implements IProducts {
    @prop()
    public id!: number

    @prop()
    public displayName!: string
  
    @prop()
    public categoryIds!: string
  
    @prop()
    public createdAt!: Date
  
    @prop()
    public minRating!: number
  
    @prop()
    public price!: number
}
  
const ProductModel = new Product().getModelForClass(Product)

export default ProductModel
