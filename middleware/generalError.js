const generalError = (app) => {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message || "Internal Server Error",
        status: err.status || 500,
      },
    });
  });
};

module.exports = generalError;
