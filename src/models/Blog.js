const { Schema, model, Types } = require('mongoose');

const BlogSchema = new Schema(
  {
    title: { type: String, requiree: true },
    content: { type: String, required: true },

    // islive 가 true 이면 유저들에게 노출 false 이면 임시저장 상태 => 우리가 islive 를 따로 명시하지 않으면 false 로 생성
    islive: { type: Boolean, required: true, default: false },

    // _id => ObjectId 타입, ref => 이 블로그의 user 가 어디를 참조하고 있는지 나타낸다. (User 컬렉션을 참조)
    // 외래키라고 생각하면 편할 것 같다.
    user: { type: Types.ObjectId, required: true, ref: 'user' },
  },
  { timestamps: true },
);

// blog 컬렉션을 생성하고 Blog 에 값을 초기화한다.
const Blog = model('blogs', BlogSchema);

module.exports = { Blog };
