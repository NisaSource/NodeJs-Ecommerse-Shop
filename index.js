const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth");
const productAdminRouter = require("./routes/admin/products");
const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ["dshkfjre5hut1fsur3fhs"],
	})
);
app.use(authRouter);
app.use(productAdminRouter);
app.use(productsRouter);
app.use(cartsRouter);
