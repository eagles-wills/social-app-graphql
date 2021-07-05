import { UserInputError } from "apollo-server";
import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcryptjs";
import moment from "moment";
import {
	validateLoginUser,
	validateRegisterUser,
} from "../../utils/validate.js";
import Users from "../../model/Users.js";

// generate token
const generateToken = (user) => {
	return jwt.sign(
		{ id: user.id, username: user.username, email: user.email },
		config.get("secretKey"),
		{ expiresIn: "4h" },
	);
};
const userResolvers = {
	Mutation: {
		registerUser: async (
			_,
			{ username, email, password, confirmPassword },
		) => {
			// validate user
			const { errors, valid } = validateRegisterUser(
				username,
				email,
				password,
				confirmPassword,
			);
			if (!valid) throw new UserInputError("Errors", { errors });
			// check if the user exists
			try {
				const userData = await Users.findOne({ username });
				if (userData)
					throw new UserInputError("Username is taken", {
						errors: { username: "username is taken" },
					});

				const newUser = new Users({
					username,
					email,
					password,
					createdAt: moment(new Date().toISOString()).toDate(),
				});
				const user = await newUser.save();
				const token = generateToken(user);
				return {
					...user._doc,
					id: user._id,
					token,
				};
			} catch (error) {
				console.log(error.message);
				throw new UserInputError("Error", { error });
			}
		},
		loginUser: async (_, { username, password }) => {
			// validate user
			const { errors, valid } = validateLoginUser(username, password);
			if (!valid) throw new UserInputError("Errors", { errors });
			// check if the user exists
			try {
				const user = await Users.findOne({ username });
				console.log(user);

				if (!user)
					throw new UserInputError("Wrong credentials", {
						errors: { username: "User not found" },
					});
				const match = await bcrypt.compare(password, user.password);
				if (!match)
					throw new UserInputError("Wrong credentials", {
						errors: { Password: "Wrong credentials" },
					});

				const token = generateToken(user);
				return {
					...user._doc,
					id: user._id,
					token,
				};
			} catch (error) {
				console.log(error.message);
				throw new UserInputError("Error", { error });
			}
		},
	},
};

export default userResolvers;
