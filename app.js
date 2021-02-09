const express = require('express')
const app = express()
const PORT = 3000 || process.env.PORT

const {
  productsRouter,
  categoriesRouter
} = require('./routes')

app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})