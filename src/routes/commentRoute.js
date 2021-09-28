const { Router } = require('express');
const { isValidObjectId } = require('mongoose');
const { Blog, User, Comment } = require('../models');

// server 에서 app.use('/blog/:blogId/comment', commentRouter); OR blogRoute 에서 blogRouter.use('/:blogId/comment', commentRouter)
// http://localhost:3000/blog/123/comment/456 ==> mergeParams: true 를 통해 blogId: 123, commentId: 456 이 찍히게 된다.
const commentRouter = Router({ mergeParams: true });
const { comment } = require('../models/Comment');

/*
  /user
  /blog
  /blog/:blogId/comment/
*/

commentRouter.post('/', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;
    if (!isValidObjectId(blogId)) return res.status(400).send({ err: 'blogId is invalid' });
    if (!isValidObjectId(userId)) return res.status(400).send({ err: 'userId is invalid' });
    if (typeof content !== 'string') return res.status(400).send({ err: 'content is requried' });

    const [blog, user] = await Promise.all([
      Blog.findByIdAndUpdate(blogId),
      User.findByIdAndUpdate(userId),
    ]);

    // await 를 두 번 따로 사용하고 있는 데 Promise.all 을 사용하면 한번에 처리가 가능 => 병렬처리를 하기 때문에 성능이 오른다.
    // const blog = await Blog.findByIdAndUpdate(blogId);
    // const user = await User.findByIdAndUpdate(userId);
    if (!blog || !user) return res.status(400).send({ err: 'blog or user does not exist' });
    if (!blog.islive) return res.status(400).send({ err: 'blog is not avaliable' });

    // DB 에서 Comment 객체를 생성하여 node.js 에 생성
    const comment = new Comment({ content, user, blog });
    await comment.save();

    return res.send({ comment });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

commentRouter.get('/', async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).send({ err: 'blogId is invalid' });

    const comments = await Comment.find({ blogId: blogId });
    return res.send({ comments });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

module.exports = { commentRouter };