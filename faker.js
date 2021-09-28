const faker = require('faker');
const { User, Blog, Comment } = require('./src/models');

// 유저를 몇 명 / 블로그를 몇 개 / 후기를 몇 개 만들지에 대한 변수를 받음
generateFakeData = async (userCount, blogsPerUser, commentsPerUser) => {
  if (typeof userCount !== 'number' || userCount < 1)
    throw new Error('userCount must be a positive integer');
  if (typeof blogsPerUser !== 'number' || blogsPerUser < 1)
    throw new Error('blogsPerUser must be a positive integer');
  if (typeof commentsPerUser !== 'number' || commentsPerUser < 1)
    throw new Error('commentsPerUser must be a positive integer');

  const users = [];
  const blogs = [];
  const comments = [];
  console.log('Preparing fake data.');

  for (let i = 0; i < userCount; i++) {
    users.push(
      new User({
        // 이름이 중복되면 오류가 뜨기 때문에 0~99 랜덤한 숫자를 뒤에 붙여주었다.
        username: faker.internet.userName() + parseInt(Math.random() * 100),
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
        age: 10 + parseInt(Math.random() * 50),
        email: faker.internet.email(),
      }),
    );
  }

  // map 을 사용해서 각 유저 별에 대한 함수 작업을 진행한다.
  users.map((user) => {
    // 입력받은 blogsPerUser 의 수에 해당하는 만큼 blog 를 생성한다.
    for (let i = 0; i < blogsPerUser; i++) {
      blogs.push(
        new Blog({
          title: faker.lorem.words(),
          content: faker.lorem.paragraphs(),
          islive: true,
          user, // user_id 가 저장된다.
        }),
      );
    }
  });

  users.map((user) => {
    for (let i = 0; i < commentsPerUser; i++) {
      // 블로그의 갯수 만큼 index 를 만든다.
      let index = Math.floor(Math.random() * blogs.length);
      comments.push(
        new Comment({
          content: faker.lorem.sentence(),
          user,
          // 가상의 blog_id 추가
          blog: blogs[index]._id,
        }),
      );
    }
  });

  console.log('fake data inserting to database...');
  // insertMany(users) => 많은 객체들이 있는 users 를 한 번에 저장한다.
  await User.insertMany(users);
  console.log(`${users.length} fake users generated!`);
  await Blog.insertMany(blogs);
  console.log(`${blogs.length} fake blogs generated!`);
  await Comment.insertMany(comments);
  console.log(`${comments.length} fake comments generated!`);
  console.log('COMPLETE!!');
};

module.exports = { generateFakeData };
