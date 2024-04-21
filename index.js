const fs = require('fs')
const http =  require('http')
const { join } = require('path')
const url =  require('url')

// const  text = fs.readFileSync('./hi.txt', 'utf-8')

// console.log(text);

// const textout = `this write file  ${text}`

// fs.writeFileSync('./output.txt', textout)

// fs.readFile('./start.txt', 'utf-8', (err, data1)=>{
//   fs.readFile(`./${data1}.txt`, 'utf-8', (err,data2)=>{
//     console.log(data2)
//     console.log(data1)
//   })  
// })


//routing

const replaceTemplate = (temp, product)=>{
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
  output = output.replace(/{%IMAGE%}/g, product.image)
  output = output.replace(/{%PRICE%}/g, product.price)
  output = output.replace(/{%FROM%}/g, product.from) 
  output = output.replace(/{%QUANTITY%}/g, product.quantity)
  output = output.replace(/{%ID%}/g, product.id)
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%INFO%}/g, product.description)
  if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
  console.log(output)
  return output 
}

const tempover = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const producttemp = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const productcard = fs.readFileSync(`${__dirname}/templates/productcard.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8', );
 const dataObj = JSON.parse(data)

const server = http.createServer((req, res ) =>{

 
 const {query, pathname}=url.parse(req.url, true)
 
 
 //OVER
 if(pathname === '/' || pathname === '/over'){
   res.writeHead(200,{'Content-type': 'text/html'})

   const cardsHtml = dataObj.map(el => replaceTemplate(productcard, el)).join('');
    const output = tempover.replace(`{%PRODUCT_CARDS%}`, cardsHtml)
  res.end(output);

  //Product
 }else if(pathname === '/product'){
  res.writeHead(200,{'Content-type': 'text/html'})
   const product = dataObj[query.id]
   const output = replaceTemplate(producttemp,product)
  res.end(output)
 } else if(pathname === '/api'){
   res.writeHead(200,{'content-type': 'application/json'})
    res.end(data)
  
  
 
 } else{

  res.writeHead(404, {
    'Content-type': 'text/html',
  })
  res.end('<h1>page not found</h1>')
 }
 
})

server.listen(8000,'127.0.0.1',() =>{
  console.log("server started")
});
 