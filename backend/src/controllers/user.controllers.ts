import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/error.middleware";
import { LoginRequestBody, NewUserRequestBody } from "../types/types";
import ErrorHandler from "../utils/errorHandler";
import { User } from "../models/auth/user.model";
import { checkHashedPassword, hashPassword } from "../utils/hashPassword";
import JWTService from "../services/jwt";
import { getRandomDarkHexColor } from "../utils/getRandomColor";

export const newUser = asyncErrorHandler(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      name,
      email,
      role,
      password,
      skills,
      seniority,
      employmentType,
      department,
    } = req.body;

    if (!name || !email || !role || !password) {
      return next(new ErrorHandler("Please provide required credentials", 400));
    }

    const userExist = await User.findOne({
      email,
    });

    if (userExist) {
      return next(new ErrorHandler("Account already exists", 400));
    }

    const hashedPassword = await hashPassword(password);

    let capacity = 0;
    if (role === "engineer" && employmentType === "fullTime") {
      capacity = 100;
    }
    if (role === "engineer" && employmentType === "partTime") {
      capacity = 50;
    }

    const codeArray = name.split(" ");

    let code = codeArray[0][0];
    if (codeArray.length > 1) {
      code += codeArray[1][0];
    }

    const colorCode = getRandomDarkHexColor();

    const userData = {
      email: email.toLowerCase(),
      code,
      password: hashedPassword,
      name,
      role,
      color: colorCode,
      skills: skills ?? null,
      seniority: seniority ?? null,
      employmentType: employmentType ?? null,
      department: department ?? null,
      maxCapacity: capacity,
    };

    const user = await User.create(userData);
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Fixed: Added function call parentheses
    const token = await JWTService.generateTokenFromUser(user);

    res.status(201).json({
      success: true,
      message: `Welcome ${name}`,
      user: userResponse,
      token,
    });
  }
);

export const loginUser = asyncErrorHandler(
  async (
    req: Request<{}, {}, LoginRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return next(
        new ErrorHandler("Please provide required credentials.", 400)
      );
    const userExist = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
      role: role,
    });

    if (!userExist) {
      return next(
        new ErrorHandler("Account does not exist. Please create one.", 400)
      );
    }
    if (typeof userExist.password !== "string") {
      return next(new ErrorHandler("User password is invalid.", 500));
    }
    const verifyPassword = await checkHashedPassword(
      password,
      userExist.password
    );

    if (!verifyPassword) {
      return next(new ErrorHandler("Incorrect password.", 400));
    }

    const token = await JWTService.generateTokenFromUser(userExist);

    res.status(200).json({
      success: true,
      message: "Successfully logged in.",
      token,
      role: userExist.role,
    });
  }
);

export const getUser = asyncErrorHandler(
  async (req, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("User not found in request", 401));
    }
    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user,
    });
  }
);
