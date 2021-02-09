const mongoose = require('mongoose')

const ProductsSchema = new mongoose.Schema ({
    displayName: String,
    categoryIds: [mongoose.Schema.Types.ObjectId],
    createdAt: Date,
    totalRating: Number,
    price: Number,
}, {
    collection: 'products'
})

module.exports = mongoose.model('Product', ProductsSchema)