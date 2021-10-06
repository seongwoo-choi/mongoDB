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
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: 'blogId is invalid' });
        if (!isValidObjectId(userId))
            return res.status(400).send({ err: 'userId is invalid' });
        if (typeof content !== 'string')
            return res.status(400).send({ err: 'content is requried' });

        const [blog, user] = await Promise.all([
            Blog.findById(blogId),
            User.findById(userId),
        ]);

        // await 를 두 번 따로 사용하고 있는 데 Promise.all 을 사용하면 한번에 처리가 가능 => 병렬처리를 하기 때문에 성능이 오른다.
        // const blog = await Blog.findByIdAndUpdate(blogId);
        // const user = await User.findByIdAndUpdate(userId);
        if (!blog || !user)
            return res.status(400).send({ err: 'blog or user does not exist' });
        if (!blog.islive)
            return res.status(400).send({ err: 'blog is not avaliable' });

        // DB 에서 Comment 객체를 생성하여 node.js 에 생성
        const comment = new Comment({
            content,
            user,
            userFullName: `${user.name.first} ${user.name.last}`,
            blog,
        });

        // // 읽기 작업을 빠르게 하기 위한 작업이다..
        // await Promise.all([
        //     comment.save(),
        //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } }),
        // ]);
        await comment.save();

        // await 가 여러번 반복되면 Promise.all([]) 로 묶어서 사용할 수 있다.
        // await comment.save();
        // 내장된 데이터를 수정할 수 있는 API 가 mongoose 에 잘 설정되어 있다. ==> $push => 자바스크립트 배열에 값을 추가하는 push 와 비슷한 역할을 한다.
        // await Blog.updateOne({ _id: blogId }, { $push: { comments: comment } });

        return res.send({ comment });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err });
    }
});

commentRouter.get('/', async (req, res) => {
    try {
        
        // 쿼리가 입력되지 않았을 때 기본값 0
        let { page = 0 } = req.query;
        page = parseInt(page);
        console.log({ page });
        
        const { blogId } = req.params;
        if (!isValidObjectId(blogId))
            return res.status(400).send({ err: 'blogId is invalid' });

        // 페이지네이션
        const comments = await Comment.find({ blogId: blogId })
            .sort({ createdAt: -1 })
            .skip(page * 3)
            .limit(3);

        return res.send({ comments });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err });
    }
});

commentRouter.patch('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (typeof content !== 'string')
        return res.status(400).send({ err: 'content is required' });

    const [comment] = await Promise.all([
        Comment.findOneAndUpdate(
            { _id: commentId },
            { content: content },
            { new: true },
        ),

        // comments._id => 자바스크립트 문법이 아닌 몽고디비 문법이다.
        // Blog 스키마 속성인 comments 의 배열 안에 _id 를 가지고 있는 객체를 찾는다는 뜻
        // comments.$.content => 필터링에 해당하는 아이디를 가지고 있는 객체의 content 값을 수정한다는 뜻
        // $ 를 사용한 이유는 Blog 스키마에서 content 는 배열이기 때문에 특정값을 알기 위해선 인덱싱이 필요한데 그 역할을 $ 가 해준다.
        // blog 의 특정 후기의 id로 필터링하여 값을 찾고 찾아진 객체의 후기(커멘트)를 수정한다
        Blog.updateOne(
            { 'comments._id': commentId },
            { 'comments.$.content': content },
        ),
    ]);

    return res.send({ comment });
});

commentRouter.delete('/:commentId', async (req, res) => {
    const { commentId } = req.params;
    // Blog 모델에 외래키로 후기의 속성이 들어있기 때문에 블로그 모델에서도 후기를 삭제해줘야 한다.
    const comment = await Comment.findOneAndDelete({ _id: commentId });
    await Blog.updateOne(
        { 'comments._id': commentId },
        // {$elemMatch: { content:"hello", title: "world" } } ⇒ content, title 둘 의 값이 모두 일치할 때 명령이 실행되도록 할 수 있다.
        // $elemMatch 를 사용하지 않으면 or 문으로 처리되어 명령이 실행된다.
        // 그렇기 때문에 $pull 을 사용했다. $pull 은 배열에서 값을 삭제하는 명령어이다.
        { $pull: { comments: { _id: commentId } } },
    );

    return res.send({ comment });
});

module.exports = { commentRouter };
