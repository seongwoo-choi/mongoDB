const { Schema, model } = require('mongoose');

// key: value 의 정보를 표시해주는 Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  age: Number,
  email: String,

  // 도큐먼트가 생성되고 수정되면 자동으로 timestamps 를 찍어준다.
}, { timestamps: true });

// 유저 컬렉션 이름 == user
const User = model('users', UserSchema);

module.exports = { User };