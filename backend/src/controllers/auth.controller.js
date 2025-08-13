import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  //so values will come from body
  const { name, email, password } = req.body;

  //check email,name and password shouuld not be empty ->using express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    throw new ApiError(400, "Invalid credintials", errors.array());
  }

  //now check if email exist already or not

  const userExists = await User.findOne({
    email: email,
  });
  //if exists throw error saying user already exists
  if (userExists) {
    throw new ApiError(400, "User Already Exists!!");
  }
  //if not ->then create new document in the db

  const user = await User.create({
    name,
    email,
    password,
  });
  if (!user) {
    throw new ApiError(400, "Something went wrong while Creating the user!!");
  }

  //return res user created

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User Registed Successfully!!"));
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      throw new ApiError(400, "Invalid credintials", errors.array());
    }
    //now check if email exist already or not
    const userExists = await User.findOne({
      email,
    });
    //if not exists throw error saying user already exists
    if (!userExists) {
      throw new ApiError(400, "User Dosn't Exists!!");
    }

    //check for valid password
    const isValidPassword = await userExists.isCorrectPassword(password);

    if (!isValidPassword) {
      throw new ApiError(400, "Invalid Password");
    }

    //if exist generate access and refresh token
    const accessToken = await userExists.generateAccessToken();
    const refreshToken = await userExists.generateRefreshToken();

    // add refreshToken to the user document
    const loginUser = await User.findByIdAndUpdate(userExists._id,{
      refreshToken:refreshToken
    }).select("-password -refreshToken");
    //store this in the cookies
    console.log(loginUser);

    const AccessTokenOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "Strict",
      // sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    };
    const RefreshTokenOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      // sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, AccessTokenOptions)
      .cookie("refreshToken", refreshToken, RefreshTokenOptions)
      .json(new ApiResponse(200, loginUser, "User Login Successfully"));
    //
  } catch (error) {
    console.error(error);
    throw new ApiError(400, error.message);
  }
};

const feedVid = async (req, res) => {
  const user = req.user;

  console.log(user);

  return res.status(200).send(`{<pre>${JSON.stringify(user)}</pre>}`);
};
export { registerUser, loginUser, feedVid };
