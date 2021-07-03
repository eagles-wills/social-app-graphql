import { UserInputError, AuthenticationError } from "apollo-server";
import moment from "moment";
import Post from "../../model/Posts.js";
import checkAuth from "../../utils/checkAuth.js";

const postResolvers = {
	Query: {
		fetchAllPosts: async (_, __) => {
			try {
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (error) {
				console.log(error);
			}
		},
	},

	Mutation: {
		createPost: async (_, { body }, context) => {
			const { username } = checkAuth(context);
			if (body.trim() === "")
				throw new UserInputError("Error", {
					errors: { error: "Body cannot be empty" },
				});
			try {
				const newPost = new Post({
					username,
					body,
					createdAt: moment(new Date().toISOString()).toDate(),
				});
				await newPost.save();
				return newPost;
			} catch (error) {
				console.log(error);
			}
		},
		deletePost: async (_, { postId }, context) => {
			const { username } = checkAuth(context);
			try {
				const post = await Post.findById(postId);
				if (post.username === username) {
					await post.remove();
				} else {
					throw new Error("User cannot delete post");
				}

				return "Post deleted Successfully";
			} catch (error) {
				console.log(error);
			}
		},

		likePost: async (_, { postId }, context) => {
			const { username } = checkAuth(context);
			const post = await Post.findById(postId);
			try {
				if (post) {
					// check if the post is already like by the user
					if (post.likes.find((like) => like.username === username)) {
						// unlike the user
						post.likes = post.likes.filter(
							(like) => like.username !== username,
						);
					} else {
						post.likes.unshift({
							username,
							createdAt: moment(new Date().toISOString()).toDate(),
						});
					}
					await post.save();
					return post;
				}
				throw new UserInputError("Error", {
					errors: { error: "post cannot be found" },
				});
			} catch (error) {
				console.log(error.message);
			}
		},

		createComment: async (_, { postId, body }, context) => {
			const { username } = checkAuth(context);
			if (body.trim() === "")
				throw new UserInputError("Error", {
					errors: { error: "body must not be empty" },
				});
			try {
				const post = await Post.findById(postId);
				if (post) {
					post.comments.unshift({
						username,
						body,
						createdAt: moment(new Date().toISOString()).toDate(),
					});
					await post.save();
					return post;
				}
				throw new UserInputError("post not found");
			} catch (error) {
				console.log(error.message);
			}
		},
		deleteComment: async (_, { postId, commentId }, context) => {
			const { username } = checkAuth(context);
			try {
				const post = await Post.findById(postId);
				const commentIndex = post.comments.findIndex(
					(comment) => comment.id === commentId,
				);
				if (
					post.comments.find((comment) => comment.username === username)
				) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					return post;
				}
				throw new AuthenticationError("Action not allowed", {
					errors: { error: "action not allowed" },
				});
			} catch (error) {
				console.log(error.message);
			}
		},
	},
};

export default postResolvers;
