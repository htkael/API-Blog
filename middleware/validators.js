const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must contain at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character"),
  body("password_conf").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match");
    }
    return true;
  }),
];

const validateJWT = async (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.status(403).json({
      message: "No authorization token provided",
      status: 403,
    });
  } else {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired token",
          status: 403,
        });
      } else {
        req.user = authData.user;
        console.log("User through JWT", req.user);
        next();
      }
    });
  }
};

const verifyAuthor = async (req, res, next) => {
  if (req.user.status !== "author") {
    return res.status(403).json({
      message: "User not authorized to create a post",
      status: 403,
    });
  }
  next();
};

module.exports = { registerValidation, validateJWT, verifyAuthor };
