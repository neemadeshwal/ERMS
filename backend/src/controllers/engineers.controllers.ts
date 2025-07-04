import { NextFunction, Response } from "express";
import { asyncErrorHandler } from "../middleware/error.middleware";
import { User } from "../models/auth/user.model";
import ErrorHandler from "../utils/errorHandler";

export const getAllEngineer = asyncErrorHandler(
  async (req, res: Response, next: NextFunction) => {
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
