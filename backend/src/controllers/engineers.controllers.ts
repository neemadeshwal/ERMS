import { NextFunction, Response } from "express";
import { asyncErrorHandler } from "../middleware/error.middleware";
import { User } from "../models/auth/user.model";
import ErrorHandler from "../utils/errorHandler";

export const getAllEngineer = asyncErrorHandler(
  async (req, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const allEngineer = await User.find({ role: "engineer" });

    res.status(200).json({
      success: true,
      message: "Successfully fetched all engineer.",
      engineer: allEngineer,
    });
  }
);

export const getSingleEngineer = asyncErrorHandler(
  async (req, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const id = req.params.id;
    const engineer = await User.find({ _id: id });

    if (!engineer) {
      return next(new ErrorHandler("engineer doesnt exist.", 400));
    }

    res.status(200).json({
      success: true,
      message: "Successfully fetched all engineer.",
      engineer: engineer,
    });
  }
);
export const editEngineer = asyncErrorHandler(
  async (req, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }

    const userExist = await User.findById({ _id: user.id });

    if (!userExist) {
      return next(new ErrorHandler("User not found", 404));
    }
    const updated = await User.findByIdAndUpdate(
      user._id,
      {
        ...req.body,
        maxCapacity: userExist.maxCapacity,
        Projects: userExist.Projects,
        Assignments: userExist.Assignments,
      },
      {
        new: true,
      }
    );
    if (!updated) {
      return next(new ErrorHandler("User is not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "User profile  updated successfully",
      project: updated,
    });
  }
);
