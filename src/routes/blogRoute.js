const { Router } = require('express');
const blogRouter = Router();
const { Blog } = require('../models/Blog');

blogRouter.post('/', async (req, res) => {
  try {

  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});


blogRouter.get('/', async (req, res) => {
  try {

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