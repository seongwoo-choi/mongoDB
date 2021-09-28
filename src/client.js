// yarn run client 스크립트를 사용하여 nodemon 을 이용해 독립적으로 실행
console.log('client code running!');

// rest API 호출할 때 자주 쓰는 모듈
const axios = require('axios');

const test = async () => {
    //  get 요청으로 blogs 를 가져온다.
    let {
        data: { blogs },
    } = await axios.get('http://localhost:3000/blog');

    // blogs 재정의
    blogs = await Promise.all(
        // blogs map 을 사용해서 배열 안에 있는 값들 하나 하나에 대한 처리를 한다.
        blogs.map(async (blog) => {
            // await 를 사용해서 res1, res2 순차적으로 실행이 된다.
            // user 에서 userId 로 get 조회 => blog 에 ref 로 user 를 참조하고 있기 때문에 blog.user 로 userId 를 사용
            const res1 = await axios.get(`http://localhost:3000/user/${blog.user}`);
            // blog 에서 blog._id 로 comment get 조회 => comment 를 조회할 때는 blog 의 id 가 필수이다.
            const res2 = await axios.get(`http://localhost:3000/blog/${blog._id}/comment`);

            blog.user = res1.data.user;
            blog.comments = res2.data.comments;
            return blog;
        }),
    );

    console.log(blogs[0]);
};

// "dev": "nodemon  --ignore client.js src/server.js" => client 파일이 수정된 것을 무시한다.
// 위와 같이 --ignore client.js 를 설정하지 않으면 오류가 발생하는데 se정rver.js 와 client.js 가 동시에 꺼졌다 동시에 켜지기 때문
test();
