const express = require('express');
const app = express();
const { userRouter, blogRouter, commentRouter } = require('./routes');
const mongoose = require('mongoose');
const { generateFakeData } = require('../faker2');

const server = async () => {
    try {
        const { MONGO_URI, PORT } = process.env;

        if (!MONGO_URI) throw new Error('MONGO_URI is required');
        if (!PORT) throw new Error('PORT is Required');

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // 쿼리들을 볼 수 있다.
        // mongoose.set('debug', true);

        console.log('MongoDB connected');

        // middleWare
        app.use(express.json());

        app.use('/', async (req, res) => {
            return res.send({
                api: 'blog api start : /user & /blog & /:blogId/comment',
            });
        });

        // /user 로 시작하면 userRouter 로 연결한다.
        app.use('/user', userRouter);
        app.use('/blog', blogRouter);

        // app.use('/blog/:blogId/comment', commentRouter);

        app.listen(PORT, async () => {
            console.log(`server listening on port ${PORT}`);
            // 유저 갯수 / 블로그 갯수 / 후기 갯수
            // await generateFakeData(10, 2, 10);
        });
    } catch (err) {
        console.log(err);
    }
};

server();
