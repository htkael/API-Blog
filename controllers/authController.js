require("dotenv").config();
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");
const bcrypt = require("bcryptjs");
const validators = require("../middleware/validators");
const registerValidation = validators.registerValidation;
const { validationResult } = require("express-validator");

exports.signup = [
  registerValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
          formData: req.body,
        });
      }
      const username = req.body.username;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const status =
        req.body.adminCode === process.env.ADMIN_SECRET ? "author" : "reader";
      const user = await prisma.user.create({
        data: {
          username: username,
          password: hashedPassword,
          status: status,
        },
      });
      return res.json({
        user,
      });
    } catch (err) {
      console.error("Could not create user", err);
      next(err);
    }
  },
];

exports.login = async (req, res, next) => {
  try {
    const username = req.body.username;
    console.log("Login attempt for username", username);
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect username",
      });
    }
    console.log("User found:", user);

    const match = await bcrypt.compare(req.body.password, user.password);
    console.log("Password match", match);
    if (!match) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
    }
    jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          status: user.status,
        },
      },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) {
          return next(err);
        }
        res.json({
          message: "Login success!",
          token,
        });
      }
    );
  } catch (err) {
    console.error("Could not login");
    next(err);
  }
};
