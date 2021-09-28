const { Router } = require('express');
const blogRouter = Router();
const { isValidObjectId } = require('mongoose');
const { User } = require('../models/User');
const { Blog } = require('../models/Blog');

blogRouter.post('/', async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;

    if (typeof title !== 'string') return res.status(400).send({ err: 'title is required' });
    if (typeof content !== 'string') return res.status(400).send({ err: 'content is required' });
    if (!isValidObjectId(userId)) return res.status(400).send({ err: 'userId is invalid' });
    if (islive && typeof islive !== 'boolean') return res.status(400).send({ err: 'islive must be a boolean' });
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
    const {userId} = req.params;
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// put 은 블로그 전체적인 것을 수정할 때 사용
blogRouter.put('/:blogId', async (req, res) => {
  try {

  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 특정 부분을 수정할 때 patch 사용
blogRouter.patch('/:blogId/live', async (req, res) => {
  try {

  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };