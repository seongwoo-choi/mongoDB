const { Router } = require('express');
const blogRouter = Router();
const { commentRouter } = require('./commentRoute');
const { isValidObjectId } = require('mongoose');
const { User } = require('../models/User');
const { Blog } = require('../models/Blog');
const path = require('path');

// blog/:blogId/comment => 미들웨어 처리
blogRouter.use('/:blogId/comment', commentRouter);

blogRouter.post('/', async (req, res) => {
    try {
        const { title, content, islive, userId } = req.body;

        // title, content 는 required=true 여서 자동으로 validation 이 된다.
        if (typeof title !== 'string')
            return res.status(400).send({ err: 'title is required' });
        if (typeof content !== 'string')
            return res.status(400).send({ err: 'content is required' });
        if (!isValidObjectId(userId))
            return res.status(400).send({ err: 'userId is invalid' });
        if (islive && typeof islive !== 'boolean')
            return res.status(400).send({ err: 'islive must be a boolean' });
        let user = await User.findById(userId);
        if (!user) return res.status(400).send({ err: 'user dose not exist' });

        // Blog 의 user는 user 컬렉션을 참조하고 있기 때문에 user 모델을 값으로 받을 수 있다.
        // findById 로 찾은 user 를 객체형태로 변환하여 Blog 모델의 속성값으로 넣었다.
        let blog = new Blog({ ...req.body, user: user.toObject() });
        await blog.save();

        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

blogRouter.get('/', async (req, res) => {
    try {
        let { page } = req.query;
        page = parseInt(page);
        console.log({ page });

        // sort({ updatedAt: -1 }) => updatedAt 내림차순으로 검색
        // skip(page * 3) => 출력할 데이터의 시작부분을 설정, value 값으로는 생략할 데이터의 갯수
        // limit(3) => 출력하는 도큐먼트의 갯수를 제한
        let blogs = await Blog.find({})
            .sort({ updatedAt: -1 })
            .skip(page * 3)
            .limit(3);

        return res.send({ blogs });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

blogRouter.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: 'blogId is invalid' });
        // const blog = await Blog.findOne({ _id: blogId });
        const blog = await Blog.findById(blogId);
        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// put 은 블로그 전체적인 것을 수정할 때 사용
blogRouter.put('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content } = req.body;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: 'blogId is invalid' });
        if (typeof title !== 'string')
            return res.status(400).send({ err: 'title is required' });
        if (typeof content !== 'string')
            return res.status(400).send({ err: 'content is required' });

        const blog = await Blog.findOneAndUpdate(
            { _id: blogId },
            { title, content },
        );

        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

// 특정 부분을 수정할 때 patch 사용
blogRouter.patch('/:blogId/live', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: 'blogId is invalid' });

        const { islive } = req.body;
        if (typeof islive !== 'boolean')
            return res.status(400).send({ err: 'islive must be a boolean' });

        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { islive },
            { new: true },
        );
        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = { blogRouter };
