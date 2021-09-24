const express = require('express');
const app = express()

app.get('/', (req, res)=>{
  return res.send('hello world1111')
})

app.listen(3000, ()=>{
  console.log('server listening on port 3000')
})