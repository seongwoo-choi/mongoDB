const express = require('express');
const app = express();

const users = [];

app.get('/user', (req, res) => {
  return res.send({ users: users });
});

app.post('/user', (req, res) => {
  uesrs.push({ name: 'how', age: 26 })
  return res.send({ success: true });
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
});