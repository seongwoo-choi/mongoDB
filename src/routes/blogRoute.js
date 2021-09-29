const { Router } = require('express');
const blogRouter = Router();
const { commentRouter } = require('./commentRoute');
const { isValidObjectId } = require('mongoose');
const { User } = require('../models/User');
const { Blog } = require('../models/Blog');

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
        // user 객체가 blog 에 들어있다.
        let blog = new Blog({ ...req.body, user });
        await blog.save();

        return res.send({ blog });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

blogRouter.get('/', async (req, res) => {
    try {
        // Blog 데이터베이스에서 20개만 가져온다.
        // path: "user" => Blog 모델의 user 속성의 값을 채우라는 뜻(user _id 를 채우라는 것)
        const blogs = await Blog.find({})
            .limit(100)
            // comments 속성을 Object id 를 가지고 객체로 치환 => comments 의 user 속성을 다시 객체로 치환
            .populate([
                { path: 'user' },
                {
                    path: 'comments',
                    populate: { path: 'user' },
                },
            ]);

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
