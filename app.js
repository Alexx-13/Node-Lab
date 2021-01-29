const express = require('express')
const app = express()
const PORT = '3000' || process.env.PORT
const urlProduct = '/products'
const unvalidUrlText = 'The url is unvalid'
const productData = require('./productData.json')

app.get(urlProduct, (req, res) => {
  try{
    res.send(JSON.stringify(productData))
  } catch(err){
    unvalidUrlText + err
  }
})

app.listen(PORT, () => {
  console.log(`The server has been launched at port: ${PORT}`)
})