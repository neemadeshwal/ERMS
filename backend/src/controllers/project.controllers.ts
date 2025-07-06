import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler } from "../middleware/error.middleware";
import ErrorHandler from "../utils/errorHandler";
import { Project } from "../models/project/project.model";

function validateProject(body: any) {
  const errors: string[] = [];
  if (!body.name || body.name.length < 2)
    errors.push("Project name is required");
  if (!body.description || body.description.length < 5)
    errors.push("Description is required");
  if (!["active", "completed", "on-hold"].includes(body.status))
    errors.push("Status must be active, completed, or on-hold");
  if (!body.startDate) errors.push("Start date is required");
  if (!body.endDate) errors.push("End date is required");
  if (!["high", "medium", "low"].includes(body.priority))
    errors.push("Priority must be high, medium, or low");
  return errors;
}

// CREATE Project
export const createProject = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const errors = validateProject(req.body);
    if (errors.length) {
      return next(new ErrorHandler(errors.join(", "), 400));
    }
    const project = await Project.create(req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  }
);

// READ All Projects
export const getProjects = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const projects = await Project.find()
      .populate("managerId")
      .populate("teamMembers");
    res.status(200).json({
      success: true,
      projects,
    });
  }
);

export const getSingleProjects = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const id = req.params.id;
    const project = await Project.findOne({ _id: id }).populate("managerId");
    res.status(200).json({
      success: true,
      project,
    });
  }
);

// UPDATE Project by ID
export const updateProject = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const { id } = req.params;
    const errors = validateProject(req.body);
    if (errors.length) {
      return next(new ErrorHandler(errors.join(", "), 400));
    }
    const updated = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) {
      return next(new ErrorHandler("Project not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updated,
    });
  }
);

// DELETE Project by ID
export const deleteProject = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ErrorHandler("Unauthorized request", 401));
    }
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return next(new ErrorHandler("Project not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  }
);
