const { Router } = require('express');
const { User, Blog } = require('../models');
const mongoose = require('mongoose');
const userRouter = Router();

// DB 작업이 들어가는 경우 async 를 사용한다.
userRouter.get('/', async (req, res) => {
    try {
        // .find => 배열을 리턴, .findOne => 값 하나를 리턴
        const users = await User.find({});
        return res.send({ users });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        // 오브젝트 id 형식에 맞는 값이면 true 아니면 false
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: 'invalid userId' });
        const user = await User.findOne({ _id: userId });
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.post('/', async (req, res) => {
    try {
        // 클라이언트가 필수값을 다 입력하지 않았을 경우 처리
        let { username, name } = req.body;
        if (!username)
            return res.status(400).send({ err: 'username is required' });
        if (!name || !name.first || !name.last)
            return res
                .status(400)
                .send({ err: 'Both first and last names are required' });

        // req.body 가 User 스키마의 key 값이 모두 동일하다고 가정한다.
        // user = { username:"", name: {first:"", last:""} } => 이렇게 저장.
        const user = new User(req.body);

        // DB에서 저장 완료가 되고나서 값이 리턴되게 하기 위해서 await 을 사용
        await user.save();

        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: 'invalid userId' });
        // findOneAndDelete => filter 에 해당하는 도큐먼트를 찾고 삭제한다. 삭제하기 전의 값을 user 에 저장하여 삭제한 값을 확인할 수 있다.
        const user = await User.findOneAndDelete({ _id: userId });
        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ err: 'invalid userId' });
        const { age, name } = req.body;
        if (!age && !name)
            return res.status(400).send({ error: 'age or name is required' });
        if (age && typeof age != 'number')
            return res.status(400).send({ err: 'age must be a number' });
        if (
            name &&
            typeof name.first !== 'string' &&
            typeof name.last !== 'string'
        )
            return res
                .status(400)
                .send({ error: 'firts and last name are string' });

        // 노드에서 User 객체를 만들어서 노드에서 자체적으로 로직을 처리하고 그 후에 서버로 값을 보내는 것
        let user = await User.findById(userId);
        // 업데이트 되기 전 user
        console.log({ userBeforeEdit: user });
        if (age) user.age = age;
        if (name) {
            user.name = name;
            // Blog 스키마를 가져오고 필터링을 한다 => user 속성의 객체의 _id 가 userId 인 녀석들의 값을 가져오고
            // 그 중에서 user 객체의 name 속성을 name 으로 변경하는데 하나만 변경하는 것이 아닌 전부 변경한다.
            // comments 속성의 배열값 안의 userFullName 속성의 값을 변경한다.
            // arrayFilters 를 이용하면 배열 객체의 값을 손쉽게 변경할 수 있다.
            // arrayFilters: [{}] 안의 값이 변경할 내용
            await Promise.all([
                Blog.updateMany({ 'user._id': userId }, { 'user.name': name }),
                Blog.updateMany(
                    {},
                    {
                        'comments.$[comment].userFullName': `${name.first} ${name.last}`,
                    },
                    { arrayFilters: [{ 'comment.user': userId }] },
                ),
            ]);
        }
        // 업데이트 된 user
        console.log({ userAfterEdit: user });
        await user.save();

        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter,
};
