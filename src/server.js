const mongoose = require('mongoose')
const express = require('express')
const app = express();
const { User } = require('./models/User');
const { URI } = require('../mongo_db_uri');

const server = async () => {

  // console.log(URI)
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    app.use(express.json());

    app.get('/user', (req, res)=>{
      return res.send()
    });

    app.post('/user', async (req, res) => {
      // req.body 가 User 스키마의 key 값이 모두 동일하다고 가정한다.
      const user = new User(req.body)
      // DB에서 저장 완료가 되고나서 값이 리턴되게 하기 위해서 awit 을 사용
      await user.save()
      return res.send({ user });
    });

    app.listen(3000, () => console.log('server listening on port 3000'))

  } catch (err) {
    console.log(err);
  }

};

server();