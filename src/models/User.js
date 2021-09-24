const mongoose = require('mongoose')

// key: value 의 정보를 표시해주는 Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  age: Number,
  email: String,
  // 생성된 시간이 나타나고 수정된 시간이 몇 시 인지 나타난다.
}, { timestamps: true });

// user 라는 컬렉션을 만들 것이고 형태는 UserSchema 형태를 가진다.
const User = mongoose.model('user', UserSchema);
module.exports = { User };