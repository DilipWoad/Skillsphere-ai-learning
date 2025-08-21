import { body } from "express-validator";

const registerValidations = [
  body("name", "Name cannot be Empty").notEmpty(),
  body("email", "Enter correct Email address.").isEmail().normalizeEmail(),
  body("password", "Password must be at least 8 characters long.")
    .isLength({ min: 8 })
    .isStrongPassword({
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
    }),
];

const loginValidations = [
  body("email", "Enter correct Email address.").isEmail().normalizeEmail(),
  body("password", "Password must be at least 8 characters long.")
    .isLength({ min: 8 })
    .isStrongPassword({
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
    }),
];

export { registerValidations, loginValidations };
