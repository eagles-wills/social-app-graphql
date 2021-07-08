import { gql } from "apollo-server";

const typeDefs = gql`
	type Likes {
		id: ID!
		username: String!
		createdAt: String!
	}

	type Comments {
		username: String!
		createdAt: String!
		body: String!
		id: ID!
	}
	type Post {
		id: ID!
		username: String!
		body: String!
		likes: [Likes]!
		comments: [Comments]!
		likeCount: Int!
		commentCount: Int!
		createdAt: String!
	}
	type User {
		id: ID!
		username: String!
		email: String!
		token: String!
		createdAt: String!
	}
	type Query {
		fetchAllPosts: [Post!]
		fetchPost(postId: ID!): Post!
	}

	type Mutation {
		registerUser(
			username: String!
			email: String!
			password: String!
			confirmPassword: String!
		): User!
		loginUser(username: String!, password: String!): User!
		createPost(body: String): Post!
		deletePost(postId: ID!): String!
		likePost(postId: ID!): Post!
		createComment(postId: ID!, body: String): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
	}
`;

export default typeDefs;
