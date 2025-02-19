const error404 = (app) => {
  app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
  });
};

module.exports = error404;
