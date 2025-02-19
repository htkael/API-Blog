const prisma = require("../prisma/client");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            status: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({
      message: "Posts found!",
      posts,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        comments: true,
        author: {
          select: {
            username: true,
            status: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json({
      message: "Post Found!",
      post,
    });
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const id = req.user.id;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
        formData: req.body,
      });
    }

    const post = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: id,
      },
      include: {
        author: {
          select: {
            username: true,
            status: true,
          },
        },
      },
    });
    res.json({
      message: "Post created successfully",
      post: post,
    });
  } catch (err) {
    err.message = "Could not create post";
    err.status = 500;
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await prisma.post.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    res.json({
      message: "Post deleted successfully",
      post: post,
    });
  } catch (err) {
    if (err.code === "P2025") {
      err.message = "Post not found";
      err.status = 404;
    } else {
      err.message = "error deleting post";
      err.status = 500;
    }
    next(err);
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
        formData: req.body,
      });
    }
    const post = await prisma.post.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        title: title,
        content: content,
      },
      include: {
        author: {
          select: {
            username: true,
            status: true,
          },
        },
      },
    });
    return res.json({
      message: "Post updated successfully",
      post: post,
    });
  } catch (err) {
    if (err.code === "P2025") {
      err.message = "Post not found";
      err.status = 404;
    } else {
      err.message = "error editing post";
      err.status = 500;
    }
    next(err);
  }
};
