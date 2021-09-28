const { Router } = require('express');

// server 에서 app.use('/blog/:blogId/comment', commentRouter); OR blogRoute 에서 blogRouter.use('/:blogId/comment', commentRouter)
// http://localhost:3000/blog/123/comment/456 ==> mergeParams: true 를 통해 blogId: 123, commentId: 456 이 찍히게 된다.
const commentRouter = Router({ mergeParams: true });
const { comment } = require('../models/Comment');

/*
  /user
  /blog
  /blog/:blogId/comment/
*/

commentRouter.post('/:commentId', async (req, res) => {
  try {
    console.log(req.params);
    return res.send(req.params);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err });
  }
});

commentRouter.get('/');

module.exports = { commentRouter };