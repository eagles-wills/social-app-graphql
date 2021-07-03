import mongoose from "mongoose";
const { Schema, model } = mongoose;

const PostSchema = new Schema({
	username: String,
	body: String,
	likes: [
		{
			username: String,
			createdAt: String,
		},
	],
	likeCount: Number,
	comments: [{ username: String, body: String, createdAt: String }],
	commentCount: Number,
	createdAt: String,
});

const Post = model("post", PostSchema);
export default Post;
