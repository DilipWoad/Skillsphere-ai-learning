import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(404, "Invalid token extraction");
    }

    const userProfile = await User.findById(user?._id).select(
      " -password -refreshToken -role"
    );

    if (!userProfile) {
      throw new ApiError(404, "User Does not Exists!");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, userProfile, "User Profile Fetched Successfully")
      );
  } catch (error) {
    console.log("Error while getting user profile :", error);
    console.error(error);
  }
};

const dashboard = async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Access to Dashboard!!"));
  } catch (error) {
    console.log(error);
    console.error(error);
  }
};

//only by Admin
const getAllUsers = async (req, res) => {
  try {
    //ONLY admin can get this
    //if middleware does not stop that means this is a admin
    const allUserDetails = await User.find().select("-password -refreshToken");
    if (allUserDetails.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "No users in the database"));
    }
    // if(!allUserDetails){
    //   throw new ApiError()
    // }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allUserDetails,
          "All User Data fetched Successfully!!"
        )
      );
  } catch (error) {
    console.error("Error while getting all the user list", error);
    console.log("Error while getting all the user list", error);
  }
};

//only by Admin
const getUserById = async (req, res) => {
  const paramsResult = validationResult(req);
  console.log(paramsResult);
  if (!paramsResult.isEmpty()) {
    throw new ApiError(401, paramsResult.errors[0].msg);
  }
  // console.log(id)
  // if (!mongoose.isValidObjectId(id)) {
  //   throw new ApiError(401, "Invalid user Id");
  // }
  const { id } = req.params;
  //check if it exists
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User does not Exists!");
  }
  //found send
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data featched Successfully!"));
};

//only by Admin
const updateUserDetails = async (req, res) => {
  const { name, role } = req.body;
  const { id } = req.params;
  //feilds are already verified
  //also the id params
  const fieldsResult = validationResult(req);
  if (!fieldsResult.isEmpty()) {
    throw new ApiError(401, fieldsResult.errors[0].msg);
  }

  //now find user doc
  const userDoc = await User.findById(id);
  if (!userDoc) {
    throw new ApiError(404, "User does not Exists!!");
  }

  //if exists update the document
  const user = await User.findByIdAndUpdate(
    id,
    {
      role,
      name,
    },
    { new: true }
  ).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(
      501,
      "Somthing went wrong while updating the User details"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User data updated Successfully!!"));
};

//only by Admin
const deleteUser = async (req, res) => {
  //verify as admin on the middleware
  //then id is validated by the express-validator
  const { id } = req.params;
  const result = validationResult(req);
  //means error are stored
  if (!result.isEmpty()) {
    throw new ApiError(401, result.errors[0].msg);
  }

  const user = await User.findByIdAndDelete(id);
  console.log("deleted User : ", user);
  if (!user) {
    throw new ApiError(501, "Somthing went wrong while deleting the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User Deleted Successfully!"));
};

export {
  getUserProfile,
  dashboard,
  getAllUsers,
  getUserById,
  updateUserDetails,
  deleteUser
};
