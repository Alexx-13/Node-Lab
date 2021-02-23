import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import * as mongoose from "mongoose";

class Product extends Typegoose {
    @prop()
    public displayName?: string;
  
    @prop()
    public categoryIds?: [mongoose.Schema.Types.ObjectId];
  
    @prop()
    public createdAt?: Date;
  
    @prop()
    public totalRating?: number;
  
    @prop()
    public price?: number;
  }
  
  const ProductModel = new Product().getModelForClass(Product)

  export default ProductModel
  