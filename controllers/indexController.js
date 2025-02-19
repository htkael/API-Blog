exports.welcomePage = async (req, res) => {
  res.json({
    message: "Welcome to the blog API",
    endpoints: {
      posts: "posts",
      comments: "posts/:postId/comments",
    },
  });
};
