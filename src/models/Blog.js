const { Schema, model, Types } = require('mongoose');
const { CommentSchema } = require('./Comment');
const { UserSchema } = require('./User');

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },

    // islive 가 true 이면 유저들에게 노출 false 이면 임시저장 상태 => 우리가 islive 를 따로 명시하지 않으면 false 로 생성
    islive: { type: Boolean, required: true, default: false },

    // user 속성을 생성 => type, ref 등 기타 옵션을 정의 => Types.ObjectId 와 users 컬렉션을 참조하고 있다는 것을 알려주고 populate 를 통해서 userId 의 실제 객체를 가져올 수 있도록 하게 했다.
    user: {
        type: Types.ObjectId,
        ref: 'users',
        required: true,
    },

    // 이런식으로 외부 스키마를 임포트해와서 넣어줄 수 있다.
    comments: [CommentSchema],
});

// BlogSchema 에 가상의 comments 속성을 생성
// BlogSchema.virtual('comments', {
//     // comments 컬렉션을 참조하는 속성이고
//     ref: 'comments',
//     // 로컬필드로는 blog 의 _id 필드를 갖고
//     localField: '_id',
//     // 외래필드로는 comments 컬렉션의 blog 속성을 갖는다.
//     foreignField: 'blog',
// });

BlogSchema.set('toObject', { virtuals: true });
BlogSchema.set('toJSON', { virtuals: true });

// blog 컬렉션을 생성하고 Blog 에 값을 초기화한다.
const Blog = model('blogs', BlogSchema);

module.exports = { Blog };
