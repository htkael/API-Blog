const prisma = require("../prisma/client");

exports.createComment = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const authorId = req.user.id;
    const content = req.body.content;

    if (!content) {
      return res.status(400).json({
        message: "Comment content is required",
        formData: req.body,
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
    });
    return res.json({
      message: "Comment created successfully",
      comment,
    });
  } catch (err) {
    err.message = "Could not create comment";
    err.status = 500;
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: req.params.commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        status: 404,
      });
    }

    if (comment.authorId !== req.user.id && req.user.status !== "author") {
      return res.status(403).json({
        message: "You cannot delete comments that are not yours",
        status: 401,
      });
    }

    const deleted = await prisma.comment.delete({
      where: {
        id: parseInt(req.params.commentId),
      },
    });
    res.json({
      message: "Comment deleted successfully",
      comment: deleted,
    });
  } catch (err) {
    if (err.code === "P2025") {
      err.message = "Comment not found";
      err.status = 404;
    } else {
      err.message = "Error deleting comment";
      err.status = 500;
    }
    next(err);
  }
};

exports.editComment = async (req, res, next) => {
  try {
    const content = req.body.content;

    if (!content) {
      return res.status(400).json({
        message: "Comment content is required",
        formData: req.body,
      });
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(req.params.commentId),
      },
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        status: 404,
      });
    }

    if (comment.authorId !== req.user.id && req.user.status !== "author") {
      return res.status(403).json({
        message: "You cannot edit comments that are not yours",
        status: 401,
      });
    }

    const edited = await prisma.comment.update({
      where: {
        id: parseInt(req.params.commentId),
      },
      data: {
        content: content,
      },
    });

    return res.json({
      message: "Comment updated successfully",
      comment: edited,
    });
  } catch (err) {
    err.message = "Could not edit comment";
    err.status = 500;
    next(err);
  }
};
