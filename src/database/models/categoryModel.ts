import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema ({
    displayName: String
}, {
    collection: 'categories'
})

export default mongoose.model('Category', CategorySchema)
