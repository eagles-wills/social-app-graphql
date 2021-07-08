import { ApolloServer, gql } from "apollo-server";
import colors from "colors";
import config from "config";
import mongoose from "mongoose";
import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
});

mongoose
	.connect(config.get("mongoLocal"), {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		server
			.listen()
			.then(({ url }) => console.log(`server running on ${url}`.blue.bold))
			.catch((err) => console.log(err.message.red));
	})
	.then(() =>
		console.log(
			`MongoDB: connected on ${mongoose.connection.host}`.green.bold,
		),
	)
	.catch((err) => console.log(err.message));
