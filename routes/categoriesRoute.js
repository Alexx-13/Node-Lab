const express = require('express')
const categoriesRouter = express.Router();
 
categoriesRouter.use("/", (request, response) => {
    response.send("Some data for categories");
});

module.exports = categoriesRouter