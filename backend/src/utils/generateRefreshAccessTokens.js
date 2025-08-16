import { ApiError } from "./ApiError.js";

const generateRefreshAccessTokens = async (user) => {
  try {
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    //set the refreshtoken to database
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.error("Error while generating Refresh and Access Tokens : ", error);
    throw new ApiError(401, "Error while generating Refresh and Access Tokens");
  }
};

export default generateRefreshAccessTokens;
