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
    console.error("Error while getting user profile :", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Somthing went wrong whle getting User Deatils");
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
        .json(new ApiResponse(200, [], "No users in the database"));
    }

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
    throw new ApiError(
      400,
      "Somthing Went wrong while fetching All User deatils"
    );
  }
};

//only by Admin
const getUserById = async (req, res) => {
  try {
    const paramsResult = validationResult(req);
    if (!paramsResult.isEmpty()) {
      throw new ApiError(400, "Invalid Id", paramsResult.array());
    }
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
  } catch (error) {
    console.error("Error while fetching a User Details : ", error);

    if (error instanceof ApiError) {
      //error throw by object of error class ->i.e ApiError
      throw error;
    }

    throw new ApiError(
      500,
      "Something went wrong while fetching a User Details"
    );
  }
};

//only by Admin
const updateUserDetails = async (req, res) => {
  try {
    const { name, role } = req.body;
    const { id } = req.params;
    //feilds are already verified
    //also the id params
    const fieldsResult = validationResult(req);
    if (!fieldsResult.isEmpty()) {
      throw new ApiError(400, "Invalid Id", fieldsResult.array());
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
      throw new ApiError(500, "Failed to update user details in the database.");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, user, "User data updated Successfully!!"));
  } catch (error) {
    console.error("Error while updating User Details :", error);

    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      501,
      "Somthing went wrong while updating the User details"
    );
  }
};

//only by Admin
const deleteUser = async (req, res) => {
  try {
    //verify as admin on the middleware
    //then id is validated by the express-validator
    const { id } = req.params;
    const result = validationResult(req);
    //means error are stored
    if (!result.isEmpty()) {
      throw new ApiError(400, "Invalid Id", result.array());
    }

    const user = await User.findByIdAndDelete(id);
    console.log("deleted User : ", user);
    if (!user) {
      throw new ApiError(500, "User does not Exists!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User Deleted Successfully!"));
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Somthing went wrong while Deleting the User!!");
  }
};

export {
  getUserProfile,
  dashboard,
  getAllUsers,
  getUserById,
  updateUserDetails,
  deleteUser,
};
