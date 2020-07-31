const { check } = require("express-validator");
const usersRepo = require("../../repositories/users");

module.exports = {
	requireTitle: check("title")
		.trim()
		.isLength({ min: 4 })
		.withMessage("Must be between 4 and 25 characters"),
	requirePrice: check("price")
		.trim()
		.toFloat()
		.isFloat({ min: 1 })
		.withMessage("Must be number greater than 1"),
	requireEmail: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Must be valid email")
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) {
				throw new Error("Email already exists");
			}
		}),
	requirePassword: check("password")
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage("Must be between 6 and 20 characters"),
	requireConfirm: check("confirm")
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage("Must be between 6 and 20 characters")
		.custom((confirm, { req }) => {
			if (confirm !== req.body.password) {
				throw new Error("Password didn't match");
			} else {
				return true;
			}
		}),
	requireEmailExist: check("email")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Invalid email")
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) {
				throw new Error("Email not found");
			}
		}),
	requireValidPass: check("password")
		.trim()
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) {
				throw new Error("Invalid email/password");
			}

			const validPass = await usersRepo.comparePass(user.password, password);
			if (!validPass) {
				throw new Error("Invalid email/password");
			}
		}),
};
