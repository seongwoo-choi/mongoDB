const express = require('express');
const app = express();

const users = [];

app.use(express.json());

app.post('/', (req, res)=>{
  users.push({name: req.body.name, age: req.body.age})
  return res.send(users)
})

app.get('/user', function(req, res) {
  return res.send({ users: users });
});

app.post('/user', function(req, res) {
  console.log(req.body);
  users.push({ name: req.body.name, age: req.body.age });
  return res.send({ sucess: req.body });
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
});