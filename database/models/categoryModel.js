const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema ({
    displayName: String
}, {
    collection: 'categories'
})

module.exports = mongoose.model('Category', CategorySchema)
