import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(404, "Invalid token extraction");
    }

    const userProfile = await User.findById(user?._id).select(
      " -password -refreshToken"
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

const dashboard=async(req,res)=>{
  try {
    return res.status(200).json(new ApiResponse(200,{},"Access to Dashboard!!"))
  } catch (error) {
    console.log(error);
    console.error(error);
  }
}

export {getUserProfile,dashboard};
