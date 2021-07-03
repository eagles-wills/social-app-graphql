import postResolvers from "./postResolvers.js";
import userResolvers from "./userResolvers.js";

const resolvers = {
	Post: {
		likeCount: (parent, _) => parent.likes.length,
		commentCount: (parent, _) => parent.comments.length,
	},
	Query: { ...postResolvers.Query, ...userResolvers.Query },
	Mutation: { ...userResolvers.Mutation, ...postResolvers.Mutation },
};

export default resolvers;
