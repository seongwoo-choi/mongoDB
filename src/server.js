const express = require('express');
const app = express();
const { userRouter, blogRouter, commentRouter } = require('./routes');
const mongoose = require('mongoose');
const { URI } = require('../mongo_db_uri');
const { generateFakeData } = require('../faker2');

const server = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // 쿼리들을 볼 수 있다.
        // mongoose.set('debug', true);

        console.log('MongoDB connected');

        // middleWare
        app.use(express.json());

        // /user 로 시작하면 userRouter 로 연결한다.
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);

        // app.use('/blog/:blogId/comment', commentRouter);

        app.listen(3000, async () => {
            console.log('server listening on port 3000');
            // 유저 갯수 / 블로그 갯수 / 후기 갯수
            // await generateFakeData(3, 5, 10);
        });
    } catch (err) {
        console.log(err);
    }
};

server();
