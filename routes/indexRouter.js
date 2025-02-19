const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
const authRouter = require("../routes/authRouter");
const postsRouter = require("../routes/postsRouter");
const validators = require("../middleware/validators");
const validateJWT = validators.validateJWT;

indexRouter.get("/", indexController.welcomePage);
indexRouter.use("/auth", authRouter);
indexRouter.use("/posts", validateJWT, postsRouter);

module.exports = indexRouter;
