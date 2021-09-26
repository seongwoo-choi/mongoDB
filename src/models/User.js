const { Schema, model } = require('mongoose')

// key: value 의 정보를 표시해주는 Schema
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  age: Number,
  email: String,
}, { timestamps: true });

const User = model('user', UserSchema);

module.exports = { User };