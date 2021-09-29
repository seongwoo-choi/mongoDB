const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const CommentSchema = new Schema(
    {
        content: { type: String, required: true },
        user: { type: ObjectId, required: true, ref: 'users' },
        blog: { type: ObjectId, required: true, ref: 'blogs' },
    },
    { timestamps: true },
);

const Comment = model('comments', CommentSchema);

module.exports = { Comment };
