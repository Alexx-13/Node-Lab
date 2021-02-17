import mongoose from 'mongoose'

const ProductsSchema = new mongoose.Schema ({
    displayName: String,
    categoryIds: [mongoose.Schema.Types.ObjectId],
    createdAt: Date,
    totalRating: Number,
    price: Number,
}, {
    collection: 'products'
})

export default mongoose.model('Product', ProductsSchema)