import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJwtTokens = async (req, res, next) => {
  //when do verify is done?
  //verfication is done for each api call in protected routes
  //like if i am calling to wattch a video i should be first verify
  //if verified then call the api-> watch video

  //what you need for verify a user api call?
  //as i have used JWT token -> for creating access and refresh token and
  try {
    let accessToken = req.cookies?.accessToken || req.header("Authorization");
    console.log(accessToken);
    //stored it in httpOnly cookie,so i can get the access-token from the cookie by using req.cookie
    if (!accessToken) {
      throw new ApiError(404, "Access token does not exists.");
    }

    if (accessToken.includes("Bearer")) {
      accessToken = accessToken.replace("Bearer ", "");
    }
    // then i will validate this jwt using jwt.verify();

    const userPayload = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRECT_KEY
    );
    // then it will give true or false accoringly
    //if false invalid access-token
    console.log(userPayload);
    if (!userPayload) {
      throw new ApiError(401, "Invalid AccessToken!");
    }
    //if matched i will extract the payload and add it to the req.user

    req.user = userPayload;
    next();
  } catch (error) {
    console.error("Invalid token :", error);
    next(error);
  }

  //and call next()
};

export {verifyJwtTokens};
