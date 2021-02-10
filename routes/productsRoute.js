const express = require('express')
const productRouter = express.Router();
const { Category } = require('../database/models')

 
productRouter.use("/", (request, response) => {
    const category = new Category({
        displayName: 'Some useless string for GET request'
    })
    category.save()
    response.send(category.displayName)
})

module.exports = productRouter