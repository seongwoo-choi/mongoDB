// yarn run client 스크립트를 사용하여 nodemon 을 이용해 독립적으로 실행
console.log('client code running!');

// rest API 호출할 때 자주 쓰는 모듈
const axios = require('axios');

const URI = 'http://localhost:3000';

const test = async () => {
    //  get 요청으로 blogs 를 가져온다.
    let {
        data: { blogs },
    } = await axios.get(`${URI}/blog`);

    // console.log(blogs[0]);

    // blogs 재정의
    blogs = await Promise.all(
        // blogs map 을 사용해서 배열 안에 있는 값들 하나 하나에 대한 처리를 한다.
        blogs.map(async (blog) => {
            // await 를 사용해서 res1, res2 순차적으로 실행이 된다.
            // user 에서 userId 로 get 조회 => blog 에 ref 로 user 를 참조하고 있기 때문에 blog.user 로 userId 를 사용
            // blog 에서 blog._id 로 comment get 조회 => comment 를 조회할 때는 blog 의 id 가 필수이다.
            // axios 는 promise 를 리턴한다. 배열로 값을 받고 배열 디스트럭쳐링을 한다.
            const [res1, res2] = await Promise.all([
                axios.get(`${URI}/user/${blog.user}`),
                axios.get(`${URI}/blog/${blog._id}/comment`),
            ]);

            blog.user = res1.data.user;

            // 비동기적으로 코멘트를 하나하나 순차적으로 담을 것
            blog.comments = await Promise.all(
                res2.data.comments.map(async (comment) => {
                    const {
                        data: { user },
                    } = await axios.get(`${URI}/user/${comment.user}`);
                    comment.user = user;
                    return comment;
                }),
            );
            return blog;
        }),
    );

    console.dir(blogs[0], { depth: 10 });
};

// "dev": "nodemon  --ignore client.js src/server.js" => client 파일이 수정된 것을 무시한다.
// 위와 같이 --ignore client.js 를 설정하지 않으면 오류가 발생하는데 se정rver.js 와 client.js 가 동시에 꺼졌다 동시에 켜지기 때문
test();
