//Imports
const { check, validationResult } = require("express-validator");

//User Validation
module.exports = function (app, io) {
  let data = { status: 0, response: "Invalid Request" },
    validator = {};

  validator.checkId = [
    check("data").notEmpty().withMessage("Data cannot be empty"),
    check("data.*.id").notEmpty().withMessage("Id is required field"),
    (req, res, next) => {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        data.response = errors[0].msg;

        return res.send(data);
      }

      return next();
    },
  ];

  validator.registerUser = [
    check("data").notEmpty().withMessage("Data cannot be empty"),
    check("data.*.fullName")
      .trim()
      .notEmpty()
      .withMessage("fullName cannot be empty"),
    check("data.*.mobileNumber")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("Mobile Number cannot be empty & should be Numeric"),
    check("data.*.mobileNumber")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile Number Should be 10 digit"),
    check("data.*.email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Email cannot be empty & should be a valid Field"),
    check("data.*.password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty"),
    check("data.*.password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password should be min 8 char and max 16 char"),
    (req, res, next) => {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        return res.send({ status: 0, response: errors[0].msg });
      }

      return next();
    },
  ];

  validator.loginUser = [
    check("data").notEmpty().withMessage("Data cannot be empty"),
    check("data.*.email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Email cannot be empty & should be a valid Field"),
    check("data.*.password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty"),
    (req, res, next) => {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        return res.send({ status: 0, response: errors[0].msg });
      }

      return next();
    },
  ];

  validator.checkEmail = [
    check("data").notEmpty().withMessage("Data cannot be empty"),
    check("data.*.email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Email cannot be empty & should be a valid Field"),
    (req, res, next) => {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        return res.send({ status: 0, response: errors[0].msg });
      }

      return next();
    },
  ];

  validator.forgotPassword = [
    check("data").notEmpty().withMessage("Data cannot be empty"),
    check("data.*.id").notEmpty().withMessage("Id is required field"),
    check("data.*.password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty"),
    check("data.*.otp").trim().notEmpty().withMessage("otp cannot be empty"),
    check("data.*.otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("otp should be 6 char"),
    // check('data.*.password').isLength({ min: 8, max: 16 }).withMessage('Password should be min 8 char and max 16 char'),
    (req, res, next) => {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        data.response = errors[0].msg;

        return res.send(data);
      }

      return next();
    },
  ];
  return validator;
};
