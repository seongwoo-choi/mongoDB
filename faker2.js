const faker = require('faker');
const { User } = require('./src/models');
const axios = require('axios');
const URI = 'http://localhost:3000';

generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
    try {
        if (typeof userCount !== 'number' || userCount < 1)
            throw new Error('userCount must be a positive integer');
        if (typeof blogsPerUser !== 'number' || blogsPerUser < 1)
            throw new Error('blogsPerUser must be a positive integer');
        if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
            throw new Error('commentsPerUser must be a positive integer');
        let users = [];
        let blogs = [];
        let comments = [];

        for (let i = 0; i < userCount; i++) {
            users.push(
                // 유저 객체를 새로 생성
                // 데이터베이스에서 리턴값을 받지 않았기 때문에 코멘트 아이디를 알 수 없다.
                new User({
                    username:
                        faker.internet.userName() +
                        parseInt(Math.random() * 100),
                    name: {
                        first: faker.name.firstName(),
                        last: faker.name.lastName(),
                    },
                    age: 10 + parseInt(Math.random() * 50),
                    email: faker.internet.email(),
                }),
            );
        }

        console.log('fake data inserting to database...');

        await User.insertMany(users);
        console.log(`${users.length} fake users generated!`);

        // 생성된 유저 배열 객체들을 가공하여 데이터베이스에 저장한다.
        users.map(user => {
            for (let i = 0; i < blogsPerUser; i++) {
                // 블로그 배열 객체 생성
                blogs.push(
                    // post API 를 사용하여 데이터를 생성 및 데이터베이스에 값을 저장
                    axios.post(`${URI}/blog`, {
                        title: faker.lorem.words(),
                        content: faker.lorem.paragraphs(),
                        islive: true,
                        userId: user.id,
                    }),
                );
            }
        });

        // newBlogs 에는 axios 의 리턴값이 저장되어 있다.
        let newBlogs = await Promise.all(blogs);
        console.log(`${newBlogs.length} fake blogs generated!`);

        users.map(user => {
            for (let i = 0; i < commentsPerUser; i++) {
                let index = Math.floor(Math.random() * blogs.length);
                comments.push(
                    // post API 를 사용하여 데이터를 생성
                    axios.post(
                        // newBlogs 배열 객체 하나 하나의 blog id 를 받아와 후기를 생성
                        `${URI}/blog/${newBlogs[index].data.blog._id}/comment`,
                        {
                            content: faker.lorem.sentence(),
                            userId: user.id,
                        },
                    ),
                );
            }
        });

        await Promise.all(comments);
        console.log(`${comments.length} fake comments generated!`);
        console.log('COMPLETE!!');
    } catch (err) {
        console.log(err);
    }
};

module.exports = { generateFakeData };
