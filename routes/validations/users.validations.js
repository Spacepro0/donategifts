const { body, validationResult } = require('express-validator');

const signupValidationRules = () => {
  return [
    body('fName').notEmpty().isString(),
    body('lName').notEmpty().isString(),
    body('email').isString().isEmail().trim(),
    body('password').notEmpty().isString().isLength({ min: 8 }),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('userRole').notEmpty().isString(),
  ];
};

const updateProfileValidationRules = () => {
  return [body('aboutMe').exists()];
};

const createAgencyValidationRules = () => {
  return [
    body('agencyName').notEmpty().isString(),
    body('agencyWebsite').optional(),
    body('agencyPhone').isNumeric().isLength({ min: 7, max: undefined }).notEmpty(),
    body('agencyBio').optional(),
  ];
};

const loginValidationRules = () => {
  return [
    body('email').notEmpty().isString().isEmail().trim(),
    body('password').notEmpty().isString(),
  ];
};

const passwordResetValidationRules = () => {
  return [
    body('password').notEmpty().isString().trim(),
    body('passwordConfirm').notEmpty().isString(),
    body('passwordConfirm').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      error: errors.array({ onlyFirstError: true })[0],
    });
  }
  next();
};

module.exports = {
  signupValidationRules,
  updateProfileValidationRules,
  createAgencyValidationRules,
  loginValidationRules,
  passwordResetValidationRules,
  validate,
};