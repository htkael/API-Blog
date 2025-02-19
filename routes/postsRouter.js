const { Router } = require("express");
const postsRouter = Router();
const postsController = require("../controllers/postsController");
const validators = require("../middleware/validators");
const verifyAuthor = validators.verifyAuthor;
const commentController = require("../controllers/commentController");

postsRouter.get("/", postsController.getPosts);
postsRouter.post("/:id/comments", commentController.createComment);
postsRouter.delete("/:id/comments/:commentId", commentController.deleteComment);
postsRouter.put("/:id/comments/:commentId", commentController.editComment);
postsRouter.get("/:id", postsController.getSinglePost);
postsRouter.post("/", verifyAuthor, postsController.createPost);
postsRouter.delete("/:id", verifyAuthor, postsController.deletePost);
postsRouter.put("/:id", verifyAuthor, postsController.editPost);

module.exports = postsRouter;
