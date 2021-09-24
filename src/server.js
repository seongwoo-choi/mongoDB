const mongoose = require('mongoose')
const express = require('express')
const app = express();
const { User } = require('./models/User');
const { URI } = require('../mongo_db_uri');

const users = [];

const server = async () => {

  // console.log(URI)
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    app.use(express.json());

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
  } catch (err) {
    console.log(err);
  }

};

server();