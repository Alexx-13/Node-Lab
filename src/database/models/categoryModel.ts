import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import * as mongoose from "mongoose";

class Category extends Typegoose {
    @prop()
    public displayName!: String
}

const CategoryModel = new Category().getModelForClass(Category)

export default CategoryModel
