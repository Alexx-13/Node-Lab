import { prop, Typegoose, ModelType, InstanceType } from 'typegoose';
import { ILastRatings } from '../../interface'

class LastRatings extends Typegoose implements ILastRatings{
    @prop()
    public _id!: number

    @prop()
    public ratings!: string
}

const LastRatingsModel = new LastRatings().getModelForClass(LastRatings)

export default LastRatingsModel
