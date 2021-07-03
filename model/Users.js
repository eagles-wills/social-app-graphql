import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
	username: String,
	email: String,
	password: String,
	createdAt: String,
});

const Users = model("user", UserSchema);
export default Users;
