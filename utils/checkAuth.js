import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import config from "config";
const checkAuth = (context) => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			// verify the token
			try {
				const user = jwt.verify(token, config.get("secretKey"));
				return user;
			} catch (error) {
				console.log(error);
				throw new AuthenticationError("Invalid/Expired Token");
			}
		}
		throw new AuthenticationError(
			"Authentication token must be a Bearer [Token]",
		);
	}
	throw new AuthenticationError("No auth header present");
};

export default checkAuth;
