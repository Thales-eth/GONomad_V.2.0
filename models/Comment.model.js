const { Schema, model } = require("mongoose")

const commentSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
        },
        review: {
            type: String,
            required: [true, 'Review field is required'],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        place_id: String
    },
    {
        timestamps: true,
    }
);

const Comment = model("Comment", commentSchema)

module.exports = Comment