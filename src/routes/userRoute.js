const { Router } = require('express');
const { User } = require('../models');
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

        // 이렇게 하는 이유? => age: age, name: name 으로 했을 경우엔 둘 중 하나의 값이 안들어왔을 경우 null 이 들어왔다고 처리를 하기 때문이다.
        // let updateBody = {};
        // if (age) updateBody.age = age;
        // if (name) updateBody.name = name;

        // key value 가 같아서 { $set: { age } } 로 간단하게 줄일 수 있다.
        // filter => userId, update => { $set: { age: age } }, options => { new: true }
        // const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });

        // 주석처리 된 위의 코드와 동일하다. 차이점은 노드에서 User 객체를 만들어서 노드에서 자체적으로 로직을 처리하고 그 후에 서버로 값을 보내는 것
        let user = await User.findById(userId);
        // 업데이트 되기 전 user
        console.log({ userBeforeEdit: user });
        if (age) user.age = age;
        if (name) user.name = name;
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
