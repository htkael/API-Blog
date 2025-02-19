const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController");

authRouter.post("/sign-up", authController.signup);
authRouter.post("/login", authController.login);

module.exports = authRouter;
