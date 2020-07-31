const express = require("express");

const { handleErrors } = require("./middlewares");
const usersRepo = require("../../repositories/users");
const registerTemplate = require("../../views/admin/auth/register");
const loginTemplate = require("../../views/admin/auth/login");
const {
	requireEmail,
	requirePassword,
	requireConfirm,
	requireEmailExist,
	requireValidPass,
} = require("./validators");

const router = express.Router();

router.get("/register", (req, res) => {
	debugger;
	res.send(registerTemplate({ req }));
});

router.post(
	"/register",
	[requireEmail, requirePassword, requireConfirm],
	handleErrors(registerTemplate),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await usersRepo.create({ email, password });

		req.session.userId = user.id;

		res.redirect("/login");
	}
);

router.get("/logout", (req, res) => {
	req.session = null;
	res.redirect("/login");
});

router.get("/login", (req, res) => {
	res.send(loginTemplate({}));
});

router.post(
	"/login",
	[requireEmailExist, requireValidPass],
	handleErrors(loginTemplate),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;

		res.redirect("/admin/products");
	}
);

module.exports = router;
