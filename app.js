const http = require('http')
const fs = require('fs')
const PORT = '3000' || process.env.PORT
const urlProduct = '/products'
const unvalidUrlText = 'The url is unvalid'
const productData = require('./productData.json')


const server = http.createServer((req, res) => {
  if(req.url === urlProduct && req.method === 'GET'){
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(JSON.stringify(productData))
  } else if(req.url === urlProduct && req.method === 'POST'){
    let body = ''

    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', () => {
      productData.push(JSON.parse(body))
      res.end(JSON.stringify(productData))
    })

  } else {
    res.writeHead(404, {'Content-Type': 'text/html'})
    res.end(unvalidUrlText)
  }
})

server.listen(PORT, () => console.log(`The server has been launched at port: ${PORT}`));
