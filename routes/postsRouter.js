const { Router } = require("express");
const postsRouter = Router();
const postsController = require("../controllers/postsController");
const validators = require("../middleware/validators");
const verifyAuthor = validators.verifyAuthor;

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:id", postsController.getSinglePost);
postsRouter.post("/", verifyAuthor, postsController.createPost);

module.exports = postsRouter;
