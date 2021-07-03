export const validateRegisterUser = (
	username,
	email,
	password,
	confirmPassword,
) => {
	let errors = {};
	if (username.trim() === "") {
		errors.username = "Please enter a username";
	}
	if (email === "") {
		errors.email = "Please enter your email address";
	} else {
		const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.match(regEx)) {
			errors.email = "Please enter a valid email";
		}
	}

	if (password === " ") {
		errors.password = "Password must not be empty";
	} else if (password.length < 6) {
		errors.password = "Password must contain at least 6 characters";
	} else if (password !== confirmPassword) {
		errors.confirmPassword = "Confirm password must be the same as password";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
export const validateLoginUser = (username, password) => {
	let errors = {};
	if (username.trim() === "") {
		errors.username = "Please enter a username";
	}

	if (password === "") {
		errors.password = "Password must not be empty";
	}
	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
