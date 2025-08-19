import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import generateRefreshAccessTokens from "../utils/generateRefreshAccessTokens.js";
import {
  AccessTokenOptions,
  RefreshTokenOptions,
} from "../utils/cookiesOptions.js";

const registerUser = async (req, res) => {
  try {
    //so values will come from body
    const { name, email, password, role } = req.body;

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
      throw new ApiError(409, "User Already Exists!!");
    }
    //if not ->then create new document in the db

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (!user) {
      throw new ApiError(500, "Something went wrong while Creating the user!!");
    }

    //return res user created

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "User Registed Successfully!!"));
  } catch (error) {
    console.error("Error while Registering the User : ", error);

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      "An unexpected error occurred during registration."
    );
  }
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
      throw new ApiError(404, "User Dosn't Exists!!");
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
    const loginUser = await User.findByIdAndUpdate(userExists._id, {
      refreshToken: refreshToken,
    }).select("-password -refreshToken -role");
    //store this in the cookies
    console.log(loginUser);
    if (!loginUser) {
      throw new ApiError(500, "Failed updating the refresh tokens");
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, AccessTokenOptions)
      .cookie("refreshToken", refreshToken, RefreshTokenOptions)
      .json(new ApiResponse(200, loginUser, "User Login Successfully"));
    //
  } catch (error) {
    console.error("Error while Login the user :", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(400, error.message);
  }
};

const feedVid = async (req, res) => {
  const user = req.user;

  console.log(user);

  return res.status(200).send(`{<pre>${JSON.stringify(user)}</pre>}`);
};

const logoutUser = async (req, res) => {
  try {
    //first of all it should be valid user -> auth.middleware
    // clear cokies both access and refresh token
    // this find the user with req.user
    //get the document and set the refreshToken filed as empty string
    // return logout successfull

    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Invalid Request Call");
    }

    const currentUser = await User.findByIdAndUpdate(user._id, {
      $unset: {
        refreshToken: 1, //or ""
      },
    });

    if (!currentUser) {
      throw new ApiError(500, "Failed while updating refreshtoken");
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logout Successfully!"));
  } catch (error) {
    console.error("Error while Logouting the user : ", error);

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Somthing went wrong while updating refreshtoken");
  }
};

const refreshTokens = async (req, res) => {
  try {
    //how is the flow
    //get the refrehtoken from cookie/body
    const receviedRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!receviedRefreshToken) {
      throw new ApiError(404, "Refresh Token does not Exists");
    }
    // ->user must not have logout
    // ->this is when accessToken expires
    // ->so that means user refreshtoken is there
    // -> so use refreshToken from cookie and match it in the database

    // ->if both matched that means it is a valid user and user has not logined in another device/tabs
    //  await jwt.verify(tokenInDb,process.env.REFRESH_TOKEN_SECRECT_KEY);
    const payload = jwt.verify(
      receviedRefreshToken,
      process.env.REFRESH_TOKEN_SECRECT_KEY
    );
    if (!payload) {
      throw new ApiError(400, "Invalid Refresh Token!");
    }

    const user = await User.findById(payload._id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.refreshToken !== receviedRefreshToken) {
      throw new ApiError(401, "Refresh token does not matched!");
    }

    // ->so now verified we can generate new access and refresh token
    const { refreshToken, accessToken } = await generateRefreshAccessTokens(
      user
    );
    // ->once generated we can then save it in the cookies and refershtoken to the database
    //now set it in the cookies again
    if (!(refreshToken && accessToken)) {
      throw new ApiError(
        501,
        "Failed while generating Refresh OR Access Token."
      );
    }

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, AccessTokenOptions)
      .cookie("accessToken", accessToken, RefreshTokenOptions)
      .json(new ApiResponse(200, {}, "User Tokens Refreshed Successfully!"));
  } catch (error) {
    console.error("Error while updating refresh token : ", error);

    if (error instanceof ApiError) {
      throw error;
    }
  }
};
export { registerUser, loginUser, feedVid, logoutUser, refreshTokens };
