import { User } from "../models/auth/user.model.js";
import JWTService from "../services/jwt.js";
import ErrorHandler from "../utils/errorHandler.js";
import { asyncErrorHandler } from "./error.middleware.js";

export const authenticated = asyncErrorHandler(async (req, res, next) => {
  console.log(
    "req.header",
    req.header("Authorization")?.replace("Bearer ", "")
  );

  const authToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!authToken) {
    return next(new ErrorHandler("Token not present", 401));
  }

  if (typeof authToken !== "string") {
    return next(new ErrorHandler("Token is not string", 401));
  }

  const decodeToken = await JWTService.decodeToken(authToken);

  if (!decodeToken || !decodeToken.email) {
    return next(new ErrorHandler("Token not valid", 401));
  }

  const user = await User.findOne({ email: decodeToken.email }).select(
    "-password"
  );

  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 401));
  }

  // Now TypeScript knows about req.user
  req.user = user;

  next();
});
