import { param, body } from "express-validator";

const allowedRoles = ["admin", "student", "instructor"];

const userIdValidation = param("id").isMongoId().withMessage("Invalid user Id");

const updateUserDetailsValidations = [
  body("name").notEmpty().withMessage("Name cannot be Empty"),
  body("role")
    .notEmpty()
    .withMessage("Role is Required")
    .isIn(allowedRoles)
    .withMessage(`Role must be one of: ${allowedRoles.join(", ")}`),
];
export { userIdValidation, updateUserDetailsValidations };
