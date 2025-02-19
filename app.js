require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");
const error404 = require("./middleware/404");
const generalError = require("./middleware/generalError");

console.log("Server Start...");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", indexRouter);

error404(app);
generalError(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app listening on PORT ${PORT}`);
});
