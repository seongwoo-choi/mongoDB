const { Schema, model, Types } = require('mongoose');
const { CommentSchema } = require('./Comment');
const { UserSchema } = require('./User');

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },

    // islive 가 true 이면 유저들에게 노출 false 이면 임시저장 상태 => 우리가 islive 를 따로 명시하지 않으면 false 로 생성
    islive: { type: Boolean, required: true, default: false },

    // 문서 내장
    user: {
        // index 추가
        _id: {
            type: Types.ObjectId,
            required: true,
            ref: 'users',
            index: true,
        },
        username: { type: String, required: true },
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
    },

    // 이런식으로 외부 스키마를 임포트해와서 넣어줄 수 있다.
    comments: [CommentSchema],
});

// user._id, updatedAt 복합키 오름차순 / , { unique: true } => 유일한 값으로 만들 수 있다.
BlogSchema.index({ 'user._id': 1, updatedAp: 1 });

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
