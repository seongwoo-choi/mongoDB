const express = require('express');
const app = express();
const { userRouter } = require('./routes/userRoute')
const mongoose = require('mongoose');
const { URI } = require('../mongo_db_uri');


const server = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // 쿼리들을 볼 수 있다.
    mongoose.set('debug', true);
    console.log('MongoDB connected');

    // middleWare
    app.use(express.json());

    // /user 로 시작하면 userRouter 로 연결한다.
    app.use('/user', userRouter)

    app.listen(3000, () => console.log('server listening on port 3000'));

  } catch (err) {
    console.log(err);
  }

};

server();